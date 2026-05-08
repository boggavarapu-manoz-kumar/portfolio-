package com.portfolio.service;

import com.portfolio.dto.BlogDto;
import com.portfolio.exception.ResourceNotFoundException;
import com.portfolio.model.Blog;
import com.portfolio.repository.BlogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BlogService {
    @Autowired
    private BlogRepository blogRepository;

    public List<BlogDto> getAllBlogs() {
        return blogRepository.findAll().stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public BlogDto getBlogById(Long id) {
        Blog blog = blogRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Blog not found with id: " + id));
        return mapToDto(blog);
    }

    public BlogDto saveBlog(BlogDto dto) {
        Blog blog = new Blog();
        blog.setId(dto.getId());
        blog.setTitle(dto.getTitle());
        blog.setContent(dto.getContent());
        blog.setImage(dto.getImage());
        
        Blog savedBlog = blogRepository.save(blog);
        return mapToDto(savedBlog);
    }

    public BlogDto updateBlog(Long id, BlogDto dto) {
        Blog blog = blogRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Blog not found with id: " + id));
        blog.setTitle(dto.getTitle());
        blog.setContent(dto.getContent());
        if (dto.getImage() != null) {
            blog.setImage(dto.getImage());
        }
        
        Blog updatedBlog = blogRepository.save(blog);
        return mapToDto(updatedBlog);
    }

    public void deleteBlog(Long id) {
        if (!blogRepository.existsById(id)) {
            throw new ResourceNotFoundException("Blog not found with id: " + id);
        }
        blogRepository.deleteById(id);
    }

    private BlogDto mapToDto(Blog blog) {
        BlogDto dto = new BlogDto();
        dto.setId(blog.getId());
        dto.setTitle(blog.getTitle());
        dto.setContent(blog.getContent());
        dto.setImage(blog.getImage());
        dto.setCreatedAt(blog.getCreatedAt());
        return dto;
    }
}
