package com.customersupport.backend.dto;

import jakarta.validation.constraints.NotBlank;

public record AddMessageRequest(

    @NotBlank(message = "Message body is required")
    String body
) {}
