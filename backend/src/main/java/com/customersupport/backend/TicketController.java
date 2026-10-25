package com.customersupport.backend;

import com.customersupport.backend.dto.*;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tickets")
public class TicketController {

    private final TicketRepository ticketRepository;
    private final TicketMessageRepository messageRepository;

    public TicketController(TicketRepository ticketRepository, TicketMessageRepository messageRepository) {
        this.ticketRepository = ticketRepository;
        this.messageRepository = messageRepository;
    }

    @GetMapping
    public List<Ticket> list() {
        return ticketRepository.findAllByOrderByCreatedAtDesc();
    }

    @PostMapping
    public ResponseEntity<Ticket> create(@Valid @RequestBody CreateTicketRequest request) {
        Ticket ticket = Ticket.builder()
                .customerEmail(request.customerEmail())
                .subject(request.subject())
                .status(TicketStatus.NEW)
                .category(TicketCategory.GENERAL)
                .build();
        return ResponseEntity.ok(ticketRepository.save(ticket));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TicketDetailResponse> get(@PathVariable Long id) {
        return ticketRepository.findById(id)
                .map(ticket -> {
                    List<TicketMessage> messages = messageRepository.findByTicketIdOrderBySentAtAsc(id);
                    return ResponseEntity.ok(TicketDetailResponse.from(ticket, messages));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Ticket> updateStatus(@PathVariable Long id,
                                               @Valid @RequestBody UpdateStatusRequest request) {
        return ticketRepository.findById(id)
                .map(ticket -> {
                    ticket.setStatus(request.status());
                    return ResponseEntity.ok(ticketRepository.save(ticket));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/category")
    public ResponseEntity<Ticket> updateCategory(@PathVariable Long id,
                                                 @Valid @RequestBody UpdateCategoryRequest request) {
        return ticketRepository.findById(id)
                .map(ticket -> {
                    ticket.setCategory(request.category());
                    return ResponseEntity.ok(ticketRepository.save(ticket));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/messages")
    public ResponseEntity<MessageResponse> addMessage(@PathVariable Long id,
                                                      @Valid @RequestBody AddMessageRequest request,
                                                      Authentication authentication) {
        return ticketRepository.findById(id)
                .map(ticket -> {
                    TicketMessage message = TicketMessage.builder()
                            .ticket(ticket)
                            .sender(authentication.getName())
                            .body(request.body())
                            .build();
                    return ResponseEntity.ok(MessageResponse.from(messageRepository.save(message)));
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
