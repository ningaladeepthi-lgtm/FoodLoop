package com.foodloop.controller;

import com.foodloop.dto.DonationDtos;
import com.foodloop.service.DonationService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/donations")
public class DonationController {

    @Autowired
    private DonationService donationService;

    @PostMapping
    public ResponseEntity<DonationDtos.DonationResponse> createDonation(
            Authentication authentication,
            @Valid @RequestBody DonationDtos.CreateDonationRequest request) {
        return ResponseEntity.ok(donationService.createDonation(authentication.getName(), request));
    }

    @GetMapping("/my-donations")
    public ResponseEntity<List<DonationDtos.DonationResponse>> getMyDonations(Authentication authentication) {
        return ResponseEntity.ok(donationService.getMyDonations(authentication.getName()));
    }

    @GetMapping("/available")
    public ResponseEntity<List<DonationDtos.DonationResponse>> getAvailableDonations() {
        return ResponseEntity.ok(donationService.getAvailableDonations());
    }

    @GetMapping
    public ResponseEntity<List<DonationDtos.DonationResponse>> getAllDonations() {
        return ResponseEntity.ok(donationService.getAllDonations());
    }

    @GetMapping("/{id}")
    public ResponseEntity<DonationDtos.DonationResponse> getDonationById(@PathVariable Long id) {
        return ResponseEntity.ok(donationService.getDonationById(id));
    }

    @PostMapping("/{id}/report-spoiled")
    public ResponseEntity<DonationDtos.DonationResponse> reportSpoiled(
            @PathVariable Long id,
            Authentication authentication,
            @RequestBody DonationDtos.SpoilageReportRequest request) {
        return ResponseEntity.ok(donationService.reportSpoiled(id, authentication.getName(), request));
    }

    @GetMapping("/public/landing")
    public ResponseEntity<List<DonationDtos.DonationResponse>> getPublicAvailableDonations() {
        return ResponseEntity.ok(donationService.getAvailableDonations());
    }
}
