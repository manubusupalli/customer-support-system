package com.customersupport.backend.dto;

import com.customersupport.backend.TicketStatus;
import jakarta.validation.constraints.NotNull;

public record UpdateStatusRequest(

    @NotNull(message = "Status is required")
    TicketStatus status
) {}
