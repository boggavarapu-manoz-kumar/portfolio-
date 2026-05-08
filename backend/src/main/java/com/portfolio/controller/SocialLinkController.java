package com.portfolio.controller;

import com.portfolio.dto.ApiResponse;
import com.portfolio.dto.SocialLinkDto;
import com.portfolio.service.SocialLinkService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/social-links")
public class SocialLinkController {

    @Autowired
    private SocialLinkService socialLinkService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<SocialLinkDto>>> getAllSocialLinks() {
        return ResponseEntity.ok(new ApiResponse<>(true, "Social links fetched successfully", socialLinkService.getAllSocialLinks()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<SocialLinkDto>> getSocialLinkById(@PathVariable Long id) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Social link fetched successfully", socialLinkService.getSocialLinkById(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<SocialLinkDto>> createSocialLink(@Valid @RequestBody SocialLinkDto socialLinkDto) {
        SocialLinkDto savedLink = socialLinkService.saveSocialLink(socialLinkDto);
        return new ResponseEntity<>(new ApiResponse<>(true, "Social link created successfully", savedLink), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<SocialLinkDto>> updateSocialLink(@PathVariable Long id, @Valid @RequestBody SocialLinkDto socialLinkDto) {
        SocialLinkDto updatedLink = socialLinkService.updateSocialLink(id, socialLinkDto);
        return ResponseEntity.ok(new ApiResponse<>(true, "Social link updated successfully", updatedLink));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteSocialLink(@PathVariable Long id) {
        socialLinkService.deleteSocialLink(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Social link deleted successfully", null));
    }
}
