package com.portfolio.service;

import com.portfolio.dto.ExperienceDto;
import com.portfolio.exception.ResourceNotFoundException;
import com.portfolio.model.Experience;
import com.portfolio.repository.ExperienceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ExperienceService {

    @Autowired
    private ExperienceRepository experienceRepository;

    public List<Experience> getAllExperiences() {
        return experienceRepository.findAll(Sort.by(Sort.Direction.ASC, "sortOrder", "id"));
    }

    public Experience getExperienceById(Long id) {
        return experienceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Experience not found with id " + id));
    }

    public Experience createExperience(ExperienceDto experienceDto) {
        Experience experience = new Experience();
        mapDtoToEntity(experienceDto, experience);
        return experienceRepository.save(experience);
    }

    public Experience updateExperience(Long id, ExperienceDto experienceDto) {
        Experience experience = getExperienceById(id);
        mapDtoToEntity(experienceDto, experience);
        return experienceRepository.save(experience);
    }

    public void deleteExperience(Long id) {
        Experience experience = getExperienceById(id);
        experienceRepository.delete(experience);
    }

    private void mapDtoToEntity(ExperienceDto dto, Experience entity) {
        entity.setTitle(dto.getTitle());
        entity.setCompany(dto.getCompany());
        entity.setCompanyLogo(dto.getCompanyLogo());
        entity.setEmploymentType(dto.getEmploymentType());
        entity.setLocation(dto.getLocation());
        entity.setLocationType(dto.getLocationType());
        entity.setStartDate(dto.getStartDate());
        entity.setEndDate(dto.getEndDate());
        entity.setDescription(dto.getDescription());
        entity.setSortOrder(dto.getSortOrder() != null ? dto.getSortOrder() : 0);
    }
}
