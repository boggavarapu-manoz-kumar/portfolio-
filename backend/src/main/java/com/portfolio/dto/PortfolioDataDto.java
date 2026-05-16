package com.portfolio.dto;

import java.util.List;

public class PortfolioDataDto {
    private ProfileDto profile;
    private List<SkillDto> skills;
    private List<ProjectDto> projects;
    private List<BlogDto> blogs;

    public PortfolioDataDto() {}

    public PortfolioDataDto(ProfileDto profile, List<SkillDto> skills, List<ProjectDto> projects, List<BlogDto> blogs) {
        this.profile = profile;
        this.skills = skills;
        this.projects = projects;
        this.blogs = blogs;
    }

    public ProfileDto getProfile() { return profile; }
    public void setProfile(ProfileDto profile) { this.profile = profile; }

    public List<SkillDto> getSkills() { return skills; }
    public void setSkills(List<SkillDto> skills) { this.skills = skills; }

    public List<ProjectDto> getProjects() { return projects; }
    public void setProjects(List<ProjectDto> projects) { this.projects = projects; }

    public List<BlogDto> getBlogs() { return blogs; }
    public void setBlogs(List<BlogDto> blogs) { this.blogs = blogs; }
}
