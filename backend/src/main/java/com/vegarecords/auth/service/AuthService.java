package com.vegarecords.auth.service;

import com.vegarecords.auth.dto.*;
import com.vegarecords.auth.entity.RefreshToken;
import com.vegarecords.auth.entity.Role;
import com.vegarecords.auth.entity.User;
import com.vegarecords.auth.exception.BadRequestException;
import com.vegarecords.auth.exception.UnauthorizedException;
import com.vegarecords.auth.repository.RefreshTokenRepository;
import com.vegarecords.auth.repository.RoleRepository;
import com.vegarecords.auth.repository.UserRepository;
import com.vegarecords.auth.security.JwtService;
import com.vegarecords.auth.mapper.UserMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final UserMapper userMapper;

    @Value("${jwt.refreshExpiration:604800000}")
    private long refreshExpirationMs;

    @Transactional
    public ApiResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email is already registered");
        }

        if (userRepository.existsByUsername(request.getUsername())) {
            throw new BadRequestException("Username is already taken");
        }

        Role userRole = roleRepository.findByRoleName("USER")
                .orElseGet(() -> roleRepository.save(Role.builder().roleName("USER").build()));

        User user = User.builder()
                .email(request.getEmail().toLowerCase().trim())
                .username(request.getUsername().toLowerCase().trim())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .gender(request.getGender())
                .role(userRole)
                .isActive(true)
                .isVerified(false)
                .build();

        userRepository.save(user);

        return ApiResponse.builder()
                .success(true)
                .message("Registration successful")
                .build();
    }

    @Transactional
    public AuthResponse login(LoginRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );
        } catch (Exception e) {
            throw new UnauthorizedException("Invalid email or password");
        }

        User user = userRepository.findByEmail(request.getEmail())
                .orElseGet(() -> userRepository.findByUsername(request.getEmail())
                        .orElseThrow(() -> new UnauthorizedException("User not found")));

        if (Boolean.FALSE.equals(user.getIsActive())) {
            throw new UnauthorizedException("Account is deactivated");
        }

        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        String accessToken = jwtService.generateToken(userDetails);
        RefreshToken refreshToken = createRefreshToken(user);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken.getToken())
                .tokenType("Bearer")
                .expiresIn(jwtService.getExpirationTime())
                .user(userMapper.toUserResponse(user))
                .build();
    }

    @Transactional
    public AuthResponse refreshToken(RefreshTokenRequest request) {
        RefreshToken refreshToken = refreshTokenRepository.findByToken(request.getRefreshToken())
                .orElseThrow(() -> new UnauthorizedException("Invalid refresh token"));

        if (refreshToken.getExpiresAt().isBefore(Instant.now())) {
            refreshTokenRepository.delete(refreshToken);
            throw new UnauthorizedException("Refresh token has expired. Please log in again.");
        }

        User user = refreshToken.getUser();
        if (Boolean.FALSE.equals(user.getIsActive())) {
            throw new UnauthorizedException("Account is deactivated");
        }

        refreshTokenRepository.delete(refreshToken);

        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        String newAccessToken = jwtService.generateToken(userDetails);
        RefreshToken newRefreshToken = createRefreshToken(user);

        return AuthResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(newRefreshToken.getToken())
                .tokenType("Bearer")
                .expiresIn(jwtService.getExpirationTime())
                .user(userMapper.toUserResponse(user))
                .build();
    }

    @Transactional
    public ApiResponse logout(RefreshTokenRequest request) {
        if (request.getRefreshToken() != null && !request.getRefreshToken().isBlank()) {
            refreshTokenRepository.deleteByToken(request.getRefreshToken());
        }
        return ApiResponse.builder()
                .success(true)
                .message("Logged out successfully")
                .build();
    }

    public AvailabilityResponse checkUsername(String username) {
        boolean exists = userRepository.existsByUsername(username);
        return AvailabilityResponse.builder()
                .available(!exists)
                .message(!exists ? "Username is available" : "Username is taken")
                .build();
    }

    public AvailabilityResponse checkEmail(String email) {
        boolean exists = userRepository.existsByEmail(email);
        return AvailabilityResponse.builder()
                .available(!exists)
                .message(!exists ? "Email is available" : "Email is registered")
                .build();
    }

    private RefreshToken createRefreshToken(User user) {
        RefreshToken refreshToken = RefreshToken.builder()
                .user(user)
                .token(UUID.randomUUID().toString())
                .expiresAt(Instant.now().plusMillis(refreshExpirationMs))
                .build();

        return refreshTokenRepository.save(refreshToken);
    }
}
