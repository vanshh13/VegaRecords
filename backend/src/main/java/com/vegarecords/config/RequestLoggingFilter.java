package com.vegarecords.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.lang.NonNull;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
@Slf4j
public class RequestLoggingFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        long startTime = System.currentTimeMillis();
        String method = request.getMethod();
        String uri = request.getRequestURI();
        String queryString = request.getQueryString() != null ? "?" + request.getQueryString() : "";
        String fullPath = uri + queryString;

        try {
            filterChain.doFilter(request, response);
        } finally {
            long duration = System.currentTimeMillis() - startTime;
            int status = response.getStatus();

            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String userStr = (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getPrincipal()))
                    ? " [User: " + auth.getName() + "]"
                    : "";

            if (status >= 500) {
                log.error("[HTTP] {} {} -> {} Error ({} ms){}", method, fullPath, status, duration, userStr);
            } else if (status >= 400) {
                log.warn("[HTTP] {} {} -> {} Warn ({} ms){}", method, fullPath, status, duration, userStr);
            } else {
                log.info("[HTTP] {} {} -> {} OK ({} ms){}", method, fullPath, status, duration, userStr);
            }
        }
    }
}
