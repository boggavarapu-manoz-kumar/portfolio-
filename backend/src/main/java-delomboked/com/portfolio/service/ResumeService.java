package com.portfolio.service;

import com.portfolio.dto.ResumeDto;
import com.portfolio.exception.ResourceNotFoundException;
import com.portfolio.model.Resume;
import com.portfolio.repository.ResumeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ResumeService {
    @Autowired
    private ResumeRepository resumeRepository;

    public List<ResumeDto> getAllResumes() {
        return resumeRepository.findAll().stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public ResumeDto getResumeById(Long id) {
        Resume resume = resumeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resume not found with id: " + id));
        return mapToDto(resume);
    }

    public ResumeDto saveResume(ResumeDto dto) {
        Resume resume = new Resume();
        resume.setId(dto.getId());
        resume.setFileUrl(dto.getFileUrl());
        
        Resume savedResume = resumeRepository.save(resume);
        return mapToDto(savedResume);
    }

    public ResumeDto updateResume(Long id, ResumeDto dto) {
        Resume resume = resumeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resume not found with id: " + id));
        resume.setFileUrl(dto.getFileUrl());
        
        Resume updatedResume = resumeRepository.save(resume);
        return mapToDto(updatedResume);
    }

    public void deleteResume(Long id) {
        if (!resumeRepository.existsById(id)) {
            throw new ResourceNotFoundException("Resume not found with id: " + id);
        }
        resumeRepository.deleteById(id);
    }

    private ResumeDto mapToDto(Resume resume) {
        ResumeDto dto = new ResumeDto();
        dto.setId(resume.getId());
        dto.setFileUrl(resume.getFileUrl());
        return dto;
    }
}
