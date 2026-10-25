package com.customersupport.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateTicketRequest(

    @NotBlank(message = "Customer email is required")
    @Email(message = "Customer email must be a valid email address")
    String customerEmail,

    @NotBlank(message = "Subject is required")
    @Size(max = 255, message = "Subject must not exceed 255 characters")
    String subject
) {}
