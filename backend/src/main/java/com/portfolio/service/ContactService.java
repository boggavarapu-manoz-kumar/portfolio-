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
        
        // Try to send email but don't block if it fails
        try {
            String subject = "New Contact Message from " + dto.getName();
            String body = "Name: " + dto.getName() + "\nEmail: " + dto.getEmail() + "\n\nMessage:\n" + dto.getMessage();
            emailService.sendEmail("manozkumarboggavarapu@gmail.com", subject, body);
        } catch (Exception e) {
            System.err.println("Failed to send contact email: " + e.getMessage());
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
