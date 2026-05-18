package com.portfolio.controller;

import com.portfolio.dto.ApiResponse;
import com.portfolio.dto.ExperienceDto;
import com.portfolio.model.Experience;
import com.portfolio.service.ExperienceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/experiences")
public class ExperienceController {

    @Autowired
    private ExperienceService experienceService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Experience>>> getAllExperiences() {
        return ResponseEntity.ok(new ApiResponse<>(true, "Experiences fetched successfully", experienceService.getAllExperiences()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Experience>> getExperienceById(@PathVariable Long id) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Experience fetched successfully", experienceService.getExperienceById(id)));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Experience>> createExperience(@Valid @RequestBody ExperienceDto experienceDto) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Experience created successfully", experienceService.createExperience(experienceDto)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Experience>> updateExperience(@PathVariable Long id, @Valid @RequestBody ExperienceDto experienceDto) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Experience updated successfully", experienceService.updateExperience(id, experienceDto)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteExperience(@PathVariable Long id) {
        experienceService.deleteExperience(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Experience deleted successfully", null));
    }
}
