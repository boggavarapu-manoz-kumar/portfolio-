package com.portfolio.service;

import com.portfolio.dto.SkillDto;
import com.portfolio.exception.ResourceNotFoundException;
import com.portfolio.model.Skill;
import com.portfolio.repository.SkillRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SkillService {
    @Autowired
    private SkillRepository skillRepository;

    @Cacheable(value = "skills")
    public List<SkillDto> getAllSkills() {
        return skillRepository.findAll().stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public SkillDto getSkillById(Long id) {
        Skill skill = skillRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Skill not found with id: " + id));
        return mapToDto(skill);
    }

    @CacheEvict(value = "skills", allEntries = true)
    public SkillDto saveSkill(SkillDto dto) {
        Skill skill = new Skill();
        skill.setId(dto.getId());
        skill.setName(dto.getName());
        skill.setLevel(dto.getLevel());
        skill.setCategory(dto.getCategory());
        skill.setLogo(dto.getLogo());
        Skill savedSkill = skillRepository.save(skill);
        return mapToDto(savedSkill);
    }

    public SkillDto updateSkill(Long id, SkillDto dto) {
        Skill skill = skillRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Skill not found with id: " + id));
        skill.setName(dto.getName());
        skill.setLevel(dto.getLevel());
        skill.setCategory(dto.getCategory());
        skill.setLogo(dto.getLogo());
        Skill updatedSkill = skillRepository.save(skill);
        return mapToDto(updatedSkill);
    }

    public void deleteSkill(Long id) {
        if (!skillRepository.existsById(id)) {
            throw new ResourceNotFoundException("Skill not found with id: " + id);
        }
        skillRepository.deleteById(id);
    }

    private SkillDto mapToDto(Skill skill) {
        SkillDto dto = new SkillDto();
        dto.setId(skill.getId());
        dto.setName(skill.getName());
        dto.setLevel(skill.getLevel());
        dto.setCategory(skill.getCategory());
        dto.setLogo(skill.getLogo());
        return dto;
    }
}
