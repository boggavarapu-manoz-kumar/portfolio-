package com.portfolio.service;

import com.portfolio.dto.ProfileDto;
import com.portfolio.model.Profile;
import com.portfolio.repository.ProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ProfileService {

    @Autowired
    private ProfileRepository profileRepository;

    public ProfileDto getProfile() {
        Profile profile = profileRepository.findById(1L).orElse(new Profile());
        return mapToDto(profile);
    }

    public ProfileDto updateProfile(ProfileDto dto) {
        Profile profile = profileRepository.findById(1L).orElse(new Profile());
        profile.setId(1L); // Ensure it's always ID 1
        profile.setName(dto.getName());
        profile.setTitle(dto.getTitle());
        profile.setBio(dto.getBio());
        profile.setAboutMe(dto.getAboutMe());
        profile.setYearsOfExperience(dto.getYearsOfExperience());
        profile.setCompletedProjects(dto.getCompletedProjects());
        profile.setHappyClients(dto.getHappyClients());
        profile.setGithubLink(dto.getGithubLink());
        profile.setLinkedinLink(dto.getLinkedinLink());
        profile.setResumeLink(dto.getResumeLink());
        profile.setProfileImage(dto.getProfileImage());

        Profile savedProfile = profileRepository.save(profile);
        return mapToDto(savedProfile);
    }

    private ProfileDto mapToDto(Profile profile) {
        ProfileDto dto = new ProfileDto();
        dto.setId(profile.getId());
        dto.setName(profile.getName());
        dto.setTitle(profile.getTitle());
        dto.setBio(profile.getBio());
        dto.setAboutMe(profile.getAboutMe());
        dto.setYearsOfExperience(profile.getYearsOfExperience());
        dto.setCompletedProjects(profile.getCompletedProjects());
        dto.setHappyClients(profile.getHappyClients());
        dto.setGithubLink(profile.getGithubLink());
        dto.setLinkedinLink(profile.getLinkedinLink());
        dto.setResumeLink(profile.getResumeLink());
        dto.setProfileImage(profile.getProfileImage());
        return dto;
    }
}
