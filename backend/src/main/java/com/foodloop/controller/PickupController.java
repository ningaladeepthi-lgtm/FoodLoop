package com.foodloop.controller;

import com.foodloop.dto.PickupDtos;
import com.foodloop.enums.PickupStatus;
import com.foodloop.service.PickupService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pickups")
public class PickupController {

    @Autowired
    private PickupService pickupService;

    @PostMapping("/accept")
    public ResponseEntity<PickupDtos.PickupResponse> acceptPickup(
            Authentication authentication,
            @RequestParam Long donationId,
            @RequestParam(required = false) Long requestId) {
        return ResponseEntity.ok(pickupService.acceptPickup(donationId, authentication.getName(), requestId));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<PickupDtos.PickupResponse> updateStatus(
            Authentication authentication,
            @PathVariable Long id,
            @RequestParam PickupStatus status) {
        return ResponseEntity.ok(pickupService.updatePickupStatus(id, authentication.getName(), status));
    }

    @GetMapping("/my-pickups")
    public ResponseEntity<List<PickupDtos.PickupResponse>> getMyPickups(Authentication authentication) {
        return ResponseEntity.ok(pickupService.getMyPickups(authentication.getName()));
    }
}
