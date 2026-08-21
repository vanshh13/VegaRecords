package com.vegarecords.health;

import com.vegarecords.auth.dto.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class HealthController {

    @GetMapping({"/health", "/api/v1/health"})
    public ResponseEntity<ApiResponse<Map<String, String>>> healthCheck() {
        Map<String, String> status = Map.of(
                "status", "UP",
                "service", "VegaRecords Backend API"
        );
        return ResponseEntity.ok(ApiResponse.success("Service is healthy", status));
    }
}
