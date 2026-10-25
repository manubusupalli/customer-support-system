package com.customersupport.backend.dto;

import com.customersupport.backend.Ticket;
import com.customersupport.backend.TicketCategory;
import com.customersupport.backend.TicketMessage;
import com.customersupport.backend.TicketStatus;

import java.time.LocalDateTime;
import java.util.List;

public record TicketDetailResponse(
    Long id,
    String customerEmail,
    String subject,
    TicketStatus status,
    TicketCategory category,
    LocalDateTime createdAt,
    LocalDateTime updatedAt,
    List<MessageResponse> messages
) {
    public static TicketDetailResponse from(Ticket ticket, List<TicketMessage> messages) {
        return new TicketDetailResponse(
            ticket.getId(),
            ticket.getCustomerEmail(),
            ticket.getSubject(),
            ticket.getStatus(),
            ticket.getCategory(),
            ticket.getCreatedAt(),
            ticket.getUpdatedAt(),
            messages.stream().map(MessageResponse::from).toList()
        );
    }
}
