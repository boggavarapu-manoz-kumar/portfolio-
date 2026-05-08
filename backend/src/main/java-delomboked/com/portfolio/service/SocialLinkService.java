package com.portfolio.service;

import com.portfolio.dto.SocialLinkDto;
import com.portfolio.exception.ResourceNotFoundException;
import com.portfolio.model.SocialLink;
import com.portfolio.repository.SocialLinkRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SocialLinkService {
    @Autowired
    private SocialLinkRepository socialLinkRepository;

    public List<SocialLinkDto> getAllSocialLinks() {
        return socialLinkRepository.findAll().stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public SocialLinkDto getSocialLinkById(Long id) {
        SocialLink link = socialLinkRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("SocialLink not found with id: " + id));
        return mapToDto(link);
    }

    public SocialLinkDto saveSocialLink(SocialLinkDto dto) {
        SocialLink link = new SocialLink();
        link.setId(dto.getId());
        link.setPlatform(dto.getPlatform());
        link.setUrl(dto.getUrl());
        link.setIcon(dto.getIcon());
        
        SocialLink savedLink = socialLinkRepository.save(link);
        return mapToDto(savedLink);
    }

    public SocialLinkDto updateSocialLink(Long id, SocialLinkDto dto) {
        SocialLink link = socialLinkRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("SocialLink not found with id: " + id));
        link.setPlatform(dto.getPlatform());
        link.setUrl(dto.getUrl());
        link.setIcon(dto.getIcon());
        
        SocialLink updatedLink = socialLinkRepository.save(link);
        return mapToDto(updatedLink);
    }

    public void deleteSocialLink(Long id) {
        if (!socialLinkRepository.existsById(id)) {
            throw new ResourceNotFoundException("SocialLink not found with id: " + id);
        }
        socialLinkRepository.deleteById(id);
    }

    private SocialLinkDto mapToDto(SocialLink link) {
        SocialLinkDto dto = new SocialLinkDto();
        dto.setId(link.getId());
        dto.setPlatform(link.getPlatform());
        dto.setUrl(link.getUrl());
        dto.setIcon(link.getIcon());
        return dto;
    }
}
