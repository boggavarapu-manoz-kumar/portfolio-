package com.portfolio.controller;

import com.portfolio.dto.ApiResponse;
import com.portfolio.dto.ProfileDto;
import com.portfolio.service.ProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    @Autowired
    private ProfileService profileService;

    @GetMapping
    public ResponseEntity<ApiResponse<ProfileDto>> getProfile() {
        return ResponseEntity.ok(new ApiResponse<>(true, "Profile fetched successfully", profileService.getProfile()));
    }

    @PutMapping
    public ResponseEntity<ApiResponse<ProfileDto>> updateProfile(@RequestBody ProfileDto profileDto) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Profile updated successfully", profileService.updateProfile(profileDto)));
    }
}
