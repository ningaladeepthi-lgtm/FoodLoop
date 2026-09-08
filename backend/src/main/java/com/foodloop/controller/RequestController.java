package com.foodloop.controller;

import com.foodloop.dto.DonationDtos;
import com.foodloop.dto.RequestDtos;
import com.foodloop.service.RequestService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/requests")
public class RequestController {

    @Autowired
    private RequestService requestService;

    @PostMapping
    public ResponseEntity<RequestDtos.RequestResponse> createRequest(
            Authentication authentication,
            @Valid @RequestBody RequestDtos.CreateRequestRequest dto) {
        return ResponseEntity.ok(requestService.createRequest(authentication.getName(), dto));
    }

    @GetMapping("/my-requests")
    public ResponseEntity<List<RequestDtos.RequestResponse>> getMyRequests(Authentication authentication) {
        return ResponseEntity.ok(requestService.getMyRequests(authentication.getName()));
    }

    @GetMapping
    public ResponseEntity<List<RequestDtos.RequestResponse>> getAllRequests() {
        return ResponseEntity.ok(requestService.getAllRequests());
    }

    @GetMapping("/{id}/matches")
    public ResponseEntity<List<DonationDtos.DonationResponse>> getRecommendedMatches(@PathVariable Long id) {
        return ResponseEntity.ok(requestService.getRecommendedMatchesForRequest(id));
    }
}
