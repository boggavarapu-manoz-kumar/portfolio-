package com.portfolio.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Service
public class FileUploadService {

    @Value("${file.upload-dir:uploads/}")
    private String baseUploadDir;

    private static final List<String> ALLOWED_IMAGE_TYPES = Arrays.asList("image/jpeg", "image/png", "image/gif");
    private static final List<String> ALLOWED_DOC_TYPES = Arrays.asList("application/pdf");
    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB limit hard check

    public String saveFile(MultipartFile file, String folderType) throws IOException {
        if (file.isEmpty()) {
            throw new RuntimeException("Failed to store empty file");
        }
        
        if (file.getSize() > MAX_FILE_SIZE) {
            throw new RuntimeException("File exceeds maximum allowed size of 5MB");
        }

        String contentType = file.getContentType();
        if ("images".equalsIgnoreCase(folderType) && (contentType == null || !ALLOWED_IMAGE_TYPES.contains(contentType))) {
            throw new RuntimeException("Only JPG, PNG and GIF allowed for images");
        } else if ("resumes".equalsIgnoreCase(folderType) && (contentType == null || !ALLOWED_DOC_TYPES.contains(contentType))) {
            throw new RuntimeException("Only PDF allowed for resumes");
        }

        String uploadDir = baseUploadDir + folderType + "/";
        File directory = new File(uploadDir);
        if (!directory.exists()) {
            directory.mkdirs();
        }

        String originalFilename = file.getOriginalFilename();
        String fileExtension = originalFilename != null ? originalFilename.substring(originalFilename.lastIndexOf(".")) : "";
        String fileName = UUID.randomUUID().toString() + fileExtension;
        
        Path path = Paths.get(uploadDir + fileName);
        Files.write(path, file.getBytes());

        return "/uploads/" + folderType + "/" + fileName;
    }
}
