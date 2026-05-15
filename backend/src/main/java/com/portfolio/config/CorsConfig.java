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
                            "https://www.manozz.site",
                            "https://manozz.site",
                            "https://*.manozz.site",
                            "https://*.vercel.app",
                            "http://localhost:5173"
                        )
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        .allowedHeaders("*")
                        .allowCredentials(true);
            }

            @Override
            public void addInterceptors(org.springframework.web.servlet.config.annotation.InterceptorRegistry registry) {
                registry.addInterceptor(new org.springframework.web.servlet.HandlerInterceptor() {
                    @Override
                    public boolean preHandle(jakarta.servlet.http.HttpServletRequest request, jakarta.servlet.http.HttpServletResponse response, Object handler) {
                        if (request.getMethod().equals("GET") && request.getRequestURI().startsWith("/api/")) {
                            response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
                        } else if (request.getMethod().equals("GET")) {
                            response.setHeader("Cache-Control", "public, max-age=3600"); // 1 hour for static assets
                        }
                        return true;
                    }
                });
            }
        };
    }
}
