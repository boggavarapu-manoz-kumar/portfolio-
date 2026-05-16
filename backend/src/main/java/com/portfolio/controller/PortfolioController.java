package com.portfolio.controller;

import com.portfolio.dto.ApiResponse;
import com.portfolio.dto.PortfolioDataDto;
import com.portfolio.service.BlogService;
import com.portfolio.service.ProfileService;
import com.portfolio.service.ProjectService;
import com.portfolio.service.SkillService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/portfolio-data")
public class PortfolioController {

    @Autowired
    private ProfileService profileService;
    @Autowired
    private SkillService skillService;
    @Autowired
    private ProjectService projectService;
    @Autowired
    private BlogService blogService;

    @GetMapping
    @Cacheable(value = "portfolioData")
    public ResponseEntity<ApiResponse<PortfolioDataDto>> getFullPortfolioData() {
        PortfolioDataDto data = new PortfolioDataDto(
            profileService.getProfile(),
            skillService.getAllSkills(),
            projectService.getAllProjects(),
            blogService.getAllBlogs()
        );
        return ResponseEntity.ok()
                .header("Cache-Control", "public, max-age=60, s-maxage=300")
                .body(new ApiResponse<>(true, "Portfolio data loaded instantly", data));
    }
}
