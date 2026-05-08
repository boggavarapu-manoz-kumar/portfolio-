package com.portfolio.controller;

import com.portfolio.dto.ApiResponse;
import com.portfolio.dto.ContactDto;
import com.portfolio.service.ContactService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contacts")
public class ContactController {

    @Autowired
    private ContactService contactService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<ContactDto>>> getAllContacts() {
        return ResponseEntity.ok(new ApiResponse<>(true, "Contacts fetched successfully", contactService.getAllContacts()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ContactDto>> getContactById(@PathVariable Long id) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Contact fetched successfully", contactService.getContactById(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ContactDto>> createContact(@Valid @RequestBody ContactDto contactDto) {
        ContactDto savedContact = contactService.saveContact(contactDto);
        return new ResponseEntity<>(new ApiResponse<>(true, "Message sent successfully", savedContact), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ContactDto>> updateContact(@PathVariable Long id, @Valid @RequestBody ContactDto contactDto) {
        ContactDto updatedContact = contactService.updateContact(id, contactDto);
        return ResponseEntity.ok(new ApiResponse<>(true, "Contact updated successfully", updatedContact));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteContact(@PathVariable Long id) {
        contactService.deleteContact(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Contact deleted successfully", null));
    }
}
