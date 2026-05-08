package com.portfolio.controller;

import com.portfolio.dto.ApiResponse;
import com.portfolio.dto.ResumeDto;
import com.portfolio.service.ResumeService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/resumes")
public class ResumeController {

    @Autowired
    private ResumeService resumeService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<ResumeDto>>> getAllResumes() {
        return ResponseEntity.ok(new ApiResponse<>(true, "Resumes fetched successfully", resumeService.getAllResumes()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ResumeDto>> getResumeById(@PathVariable Long id) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Resume fetched successfully", resumeService.getResumeById(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ResumeDto>> createResume(@Valid @RequestBody ResumeDto resumeDto) {
        ResumeDto savedResume = resumeService.saveResume(resumeDto);
        return new ResponseEntity<>(new ApiResponse<>(true, "Resume created successfully", savedResume), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ResumeDto>> updateResume(@PathVariable Long id, @Valid @RequestBody ResumeDto resumeDto) {
        ResumeDto updatedResume = resumeService.updateResume(id, resumeDto);
        return ResponseEntity.ok(new ApiResponse<>(true, "Resume updated successfully", updatedResume));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteResume(@PathVariable Long id) {
        resumeService.deleteResume(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Resume deleted successfully", null));
    }
}
