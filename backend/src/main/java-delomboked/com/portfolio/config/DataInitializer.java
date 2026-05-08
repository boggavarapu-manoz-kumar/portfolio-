package com.portfolio.config;

import com.portfolio.model.Project;
import com.portfolio.model.Skill;
import com.portfolio.model.User;
import com.portfolio.repository.ProjectRepository;
import com.portfolio.repository.SkillRepository;
import com.portfolio.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initData(UserRepository userRepository, 
                                      SkillRepository skillRepository, 
                                      ProjectRepository projectRepository, 
                                      PasswordEncoder passwordEncoder) {
        return args -> {
            // Check if admin user exists, if not create one
            if (userRepository.findByUsername("admin").isEmpty()) {
                User admin = new User();
                admin.setUsername("admin");
                admin.setPassword(passwordEncoder.encode("admin123")); // Default password
                userRepository.save(admin);
                System.out.println("Admin user created.");
            }

            // Initialize Skills if empty
            if (skillRepository.count() == 0) {
                skillRepository.save(new Skill(null, "Java / Spring Boot", "Expert"));
                skillRepository.save(new Skill(null, "React / Next.js", "Advanced"));
                skillRepository.save(new Skill(null, "MySQL / Postgres", "Intermediate"));
                System.out.println("Sample skills created.");
            }

            // Initialize Projects if empty
            if (projectRepository.count() == 0) {
                projectRepository.save(new Project(
                        null, 
                        "E-Commerce Platform", 
                        "A fully functional e-commerce platform with payment gateway integration.", 
                        "React, Spring Boot, MySQL", 
                        "https://github.com/admin/ecommerce", 
                        "https://myecommerce.com", 
                        "/uploads/images/default_ecommerce.jpg"));
                        
                projectRepository.save(new Project(
                        null, 
                        "Social Media Dashboard", 
                        "Analytics dashboard for managing social media profiles.", 
                        "Next.js, Node.js, MongoDB", 
                        "https://github.com/admin/social-dashboard", 
                        "https://socialdashboard.com", 
                        "/uploads/images/default_dashboard.jpg"));
                System.out.println("Sample projects created.");
            }

            // Initialize Blog if empty
            if (blogRepository.count() == 0) {
                blogRepository.save(new com.portfolio.model.Blog(
                        null,
                        "My First Tech Blog",
                        "This is a comprehensive guide about modern web development featuring Spring Boot and React.",
                        "/uploads/images/blog_1.jpg",
                        java.time.LocalDateTime.now()
                ));
                System.out.println("Sample blog created.");
            }
        };
    }
}
