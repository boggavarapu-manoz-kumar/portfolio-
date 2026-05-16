package com.portfolio.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOriginPatterns(
                            "https://manozz.site",
                            "https://www.manozz.site",
                            "https://*.manozz.site",
                            "https://*.vercel.app",
                            "http://localhost:5173",
                            "http://localhost:3000"
                        )
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH")
                        .allowedHeaders("*")
                        .exposedHeaders("Authorization")
                        .allowCredentials(true)
                        .maxAge(3600); // 1 hour pre-flight cache
            }

            @Override
            public void addInterceptors(org.springframework.web.servlet.config.annotation.InterceptorRegistry registry) {
                registry.addInterceptor(new org.springframework.web.servlet.HandlerInterceptor() {
                    @Override
                    public boolean preHandle(jakarta.servlet.http.HttpServletRequest request, jakarta.servlet.http.HttpServletResponse response, Object handler) {
                        String path = request.getRequestURI();
                        if (request.getMethod().equals("GET")) {
                            if (path.startsWith("/api/")) {
                                // For API requests, ensure we get fresh data but allow some validation
                                response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
                            } else {
                                // For static assets like uploads, cache for 1 hour
                                response.setHeader("Cache-Control", "public, max-age=3600");
                            }
                        }
                        return true;
                    }
                });
            }
        };
    }
}

