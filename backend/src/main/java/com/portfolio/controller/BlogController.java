package com.portfolio.controller;

import com.portfolio.dto.ApiResponse;
import com.portfolio.dto.BlogDto;
import com.portfolio.service.BlogService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/blogs")
public class BlogController {

    @Autowired
    private BlogService blogService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<BlogDto>>> getAllBlogs() {
        return ResponseEntity.ok(new ApiResponse<>(true, "Blogs fetched successfully", blogService.getAllBlogs()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<BlogDto>> getBlogById(@PathVariable Long id) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Blog fetched successfully", blogService.getBlogById(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<BlogDto>> createBlog(@Valid @RequestBody BlogDto blogDto) {
        BlogDto savedBlog = blogService.saveBlog(blogDto);
        return new ResponseEntity<>(new ApiResponse<>(true, "Blog created successfully", savedBlog), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<BlogDto>> updateBlog(@PathVariable Long id, @Valid @RequestBody BlogDto blogDto) {
        BlogDto updatedBlog = blogService.updateBlog(id, blogDto);
        return ResponseEntity.ok(new ApiResponse<>(true, "Blog updated successfully", updatedBlog));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteBlog(@PathVariable Long id) {
        blogService.deleteBlog(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Blog deleted successfully", null));
    }
}
