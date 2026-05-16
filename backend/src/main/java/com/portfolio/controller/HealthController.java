package com.portfolio.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.HashMap;
import java.util.Map;

@RestController
public class HealthController {

    private static final long startTime = System.currentTimeMillis();

    @GetMapping("/")
    public Map<String, Object> healthCheck() {
        Map<String, Object> status = new HashMap<>();
        status.put("status", "UP");
        status.put("message", "Portfolio Backend API is running perfectly!");
        
        // Uptime tracking
        long uptimeMillis = System.currentTimeMillis() - startTime;
        status.put("uptime_seconds", uptimeMillis / 1000);
        
        // System stats for the "Perfect" view
        Runtime runtime = Runtime.getRuntime();
        Map<String, String> system = new HashMap<>();
        system.put("memory_total", (runtime.totalMemory() / 1024 / 1024) + "MB");
        system.put("memory_free", (runtime.freeMemory() / 1024 / 1024) + "MB");
        status.put("system", system);
        
        return status;
    }
    
    @GetMapping("/api/health")
    public Map<String, String> apiHealthCheck() {
        Map<String, String> status = new HashMap<>();
        status.put("status", "UP");
        status.put("message", "API endpoints are accessible.");
        return status;
    }
}

