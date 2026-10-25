package com.customersupport.backend.dto;

import com.customersupport.backend.TicketMessage;

import java.time.LocalDateTime;

public record MessageResponse(
    Long id,
    String sender,
    String body,
    LocalDateTime sentAt
) {
    public static MessageResponse from(TicketMessage m) {
        return new MessageResponse(m.getId(), m.getSender(), m.getBody(), m.getSentAt());
    }
}
