package com.portfolio.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.web.client.RestTemplate;

@Configuration
public class KeepAliveTask {

    private final RestTemplate restTemplate = new RestTemplate();

    // Runs every 10 minutes to keep the Render free tier from sleeping
    @Scheduled(fixedRate = 600000)
    public void pingSelf() {
        try {
            // Using the public render URL to ensure it registers as external traffic
            String url = "https://manoj-portfolio-api-lpw5.onrender.com/api/health";
            restTemplate.getForObject(url, String.class);
            System.out.println("Keep-alive ping sent to self successfully");
        } catch (Exception e) {
            System.err.println("Keep-alive ping failed: " + e.getMessage());
        }
    }
}
