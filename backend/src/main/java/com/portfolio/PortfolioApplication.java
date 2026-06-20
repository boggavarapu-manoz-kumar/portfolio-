package com.portfolio;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableAsync
@EnableCaching
@EnableScheduling
public class PortfolioApplication {
    private static org.springframework.context.ApplicationContext context;

    public static void main(String[] args) {
        context = SpringApplication.run(PortfolioApplication.class, args);
    }

    public static org.springframework.context.ApplicationContext getContext() {
        return context;
    }
}
