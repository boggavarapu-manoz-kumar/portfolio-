package com.portfolio.service;

import com.portfolio.dto.ContactDto;
import com.portfolio.exception.ResourceNotFoundException;
import com.portfolio.model.Contact;
import com.portfolio.repository.ContactRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ContactService {
    @Autowired
    private ContactRepository contactRepository;

    @Autowired
    private EmailService emailService;

    public List<ContactDto> getAllContacts() {
        return contactRepository.findAll().stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public ContactDto getContactById(Long id) {
        Contact contact = contactRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Contact not found with id: " + id));
        return mapToDto(contact);
    }

    public ContactDto saveContact(ContactDto dto) {
        Contact contact = new Contact();
        contact.setId(dto.getId());
        contact.setName(dto.getName());
        contact.setEmail(dto.getEmail());
        contact.setMessage(dto.getMessage());
        
        Contact savedContact = contactRepository.save(contact);
        
        // ULTIMATE OPTIMIZATION: Use dedicated high-priority thread pool for instant mail processing
        try {
            org.springframework.context.ApplicationContext context = com.portfolio.PortfolioApplication.getContext();
            java.util.concurrent.Executor executor = (java.util.concurrent.Executor) context.getBean("taskExecutor");
            executor.execute(() -> {
                try {
                    String subject = "New Portfolio Message: " + dto.getName();
                    String body = "Name: " + dto.getName() + "\nEmail: " + dto.getEmail() + "\n\nMessage:\n" + dto.getMessage();
                    emailService.sendEmail("manozkumarboggavarapu@gmail.com", subject, body);
                } catch (Exception e) {
                    System.err.println("High-priority email task failed: " + e.getMessage());
                }
            });
        } catch (Exception e) {
            // Fallback to default async if bean not found for some reason
            java.util.concurrent.CompletableFuture.runAsync(() -> {
                emailService.sendEmail("manozkumarboggavarapu@gmail.com", "Message from " + dto.getName(), dto.getMessage());
            });
        }

        return mapToDto(savedContact);
    }

    public ContactDto updateContact(Long id, ContactDto dto) {
        Contact contact = contactRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Contact not found with id: " + id));
        contact.setName(dto.getName());
        contact.setEmail(dto.getEmail());
        contact.setMessage(dto.getMessage());
        
        Contact updatedContact = contactRepository.save(contact);
        return mapToDto(updatedContact);
    }

    public void deleteContact(Long id) {
        if (!contactRepository.existsById(id)) {
            throw new ResourceNotFoundException("Contact not found with id: " + id);
        }
        contactRepository.deleteById(id);
    }

    private ContactDto mapToDto(Contact contact) {
        ContactDto dto = new ContactDto();
        dto.setId(contact.getId());
        dto.setName(contact.getName());
        dto.setEmail(contact.getEmail());
        dto.setMessage(contact.getMessage());
        dto.setCreatedAt(contact.getCreatedAt());
        return dto;
    }
}
