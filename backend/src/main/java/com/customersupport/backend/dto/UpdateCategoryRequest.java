package com.customersupport.backend.dto;

import com.customersupport.backend.TicketCategory;
import jakarta.validation.constraints.NotNull;

public record UpdateCategoryRequest(

    @NotNull(message = "Category is required")
    TicketCategory category
) {}
