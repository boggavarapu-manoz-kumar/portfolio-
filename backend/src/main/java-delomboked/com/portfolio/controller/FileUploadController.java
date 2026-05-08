package com.portfolio.controller;

import com.portfolio.dto.ApiResponse;
import com.portfolio.service.FileUploadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/upload")
public class FileUploadController {

    @Autowired
    private FileUploadService fileUploadService;

    @PostMapping("/image")
    public ResponseEntity<ApiResponse<Map<String, String>>> uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            String fileUrl = fileUploadService.saveFile(file, "images");
            Map<String, String> data = new HashMap<>();
            data.put("url", fileUrl);
            return ResponseEntity.ok(new ApiResponse<>(true, "Image uploaded successfully", data));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    @PostMapping("/resume")
    public ResponseEntity<ApiResponse<Map<String, String>>> uploadResume(@RequestParam("file") MultipartFile file) {
        try {
            String fileUrl = fileUploadService.saveFile(file, "resumes");
            Map<String, String> data = new HashMap<>();
            data.put("url", fileUrl);
            return ResponseEntity.ok(new ApiResponse<>(true, "Resume uploaded successfully", data));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }
}
