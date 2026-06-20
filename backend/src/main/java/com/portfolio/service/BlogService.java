package com.portfolio.service;

import com.portfolio.dto.BlogDto;
import com.portfolio.exception.ResourceNotFoundException;
import com.portfolio.model.Blog;
import com.portfolio.repository.BlogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BlogService {
    @Autowired
    private BlogRepository blogRepository;

    @Cacheable(value = "blogs")
    public List<BlogDto> getAllBlogs() {
        return blogRepository.findAll().stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Cacheable(value = "blogs", key = "#id")
    public BlogDto getBlogById(Long id) {
        Blog blog = blogRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Blog not found with id: " + id));
        return mapToDto(blog);
    }

    @CacheEvict(value = "blogs", allEntries = true)
    public BlogDto saveBlog(BlogDto dto) {
        Blog blog = new Blog();
        blog.setId(dto.getId());
        blog.setTitle(dto.getTitle());
        blog.setContent(dto.getContent());
        blog.setImage(dto.getImage());
        blog.setExternalLink(dto.getExternalLink());
        
        Blog savedBlog = blogRepository.save(blog);
        return mapToDto(savedBlog);
    }

    @CacheEvict(value = "blogs", allEntries = true)
    public BlogDto updateBlog(Long id, BlogDto dto) {
        Blog blog = blogRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Blog not found with id: " + id));
        blog.setTitle(dto.getTitle());
        blog.setContent(dto.getContent());
        if (dto.getImage() != null) {
            blog.setImage(dto.getImage());
        }
        if (dto.getExternalLink() != null) {
            blog.setExternalLink(dto.getExternalLink());
        }
        
        Blog updatedBlog = blogRepository.save(blog);
        return mapToDto(updatedBlog);
    }

    @CacheEvict(value = "blogs", allEntries = true)
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
        dto.setExternalLink(blog.getExternalLink());
        dto.setCreatedAt(blog.getCreatedAt());
        return dto;
    }
}
