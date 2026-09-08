package com.foodloop.service;

import com.foodloop.dto.AuthDtos;
import com.foodloop.dto.DonationDtos;
import com.foodloop.entity.Donation;
import com.foodloop.entity.DonationHistory;
import com.foodloop.entity.FoodSafetyRecord;
import com.foodloop.entity.User;
import com.foodloop.enums.DonationStatus;
import com.foodloop.enums.Priority;
import com.foodloop.enums.Role;
import com.foodloop.enums.UrgencyLevel;
import com.foodloop.repository.DonationHistoryRepository;
import com.foodloop.repository.DonationRepository;
import com.foodloop.repository.FoodSafetyRecordRepository;
import com.foodloop.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DonationService {

    @Autowired
    private DonationRepository donationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DonationHistoryRepository historyRepository;

    @Autowired
    private FoodSafetyRecordRepository safetyRecordRepository;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private AuthService authService;

    @Transactional
    public DonationDtos.DonationResponse createDonation(String userEmail, DonationDtos.CreateDonationRequest request) {
        User donor = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Donor not found"));

        Donation donation = new Donation();
        donation.setDonor(donor);
        donation.setFoodType(request.getFoodType());
        donation.setFoodCategory(request.getFoodCategory());
        donation.setQuantity(request.getQuantity());
        donation.setUnit(request.getUnit());
        donation.setServings(request.getServings() != null ? request.getServings() : (int)(request.getQuantity() * 2));
        donation.setFoodCondition(request.getFoodCondition() != null ? request.getFoodCondition() : "Fresh");
        donation.setDietaryType(request.getDietaryType() != null ? request.getDietaryType() : "Veg");
        
        donation.setPreparedAt(request.getPreparedAt() != null ? request.getPreparedAt() : LocalDateTime.now().minusHours(1));
        donation.setDonatedAt(LocalDateTime.now());
        
        // Default expiry is 6 hours from now if not specified
        donation.setExpiryAt(request.getExpiryAt() != null ? request.getExpiryAt() : LocalDateTime.now().plusHours(6));

        donation.setPickupAddress(request.getPickupAddress());
        donation.setLatitude(request.getLatitude() != null ? request.getLatitude() : 17.3850);
        donation.setLongitude(request.getLongitude() != null ? request.getLongitude() : 78.4867);
        donation.setImageUrl(request.getImageUrl());
        donation.setSpecialInstructions(request.getSpecialInstructions());
        donation.setStatus(DonationStatus.AVAILABLE);

        Donation saved = donationRepository.save(donation);

        // Record history
        recordHistory(saved, null, DonationStatus.AVAILABLE, donor.getName(), "Donation created");

        // Notify volunteers
        notificationService.notifyVolunteersOfNewDonation(saved);

        return convertToResponse(saved);
    }

    public List<DonationDtos.DonationResponse> getMyDonations(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return donationRepository.findByDonorIdOrderByCreatedAtDesc(user.getId())
                .stream().map(this::convertToResponse).collect(Collectors.toList());
    }

    public List<DonationDtos.DonationResponse> getAvailableDonations() {
        LocalDateTime now = LocalDateTime.now();
        List<Donation> available = donationRepository.findAvailableAndNotExpired(now);
        
        // Prioritize by Urgency Level / earliest expiry
        available.sort(Comparator.comparing(Donation::getExpiryAt));
        
        return available.stream().map(this::convertToResponse).collect(Collectors.toList());
    }

    public List<DonationDtos.DonationResponse> getAllDonations() {
        return donationRepository.findAll().stream()
                .sorted(Comparator.comparing(Donation::getCreatedAt).reversed())
                .map(this::convertToResponse).collect(Collectors.toList());
    }

    public DonationDtos.DonationResponse getDonationById(Long id) {
        Donation donation = donationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Donation not found with ID: " + id));
        return convertToResponse(donation);
    }

    @Transactional
    public DonationDtos.DonationResponse reportSpoiled(Long id, String userEmail, DonationDtos.SpoilageReportRequest request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Donation donation = donationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Donation not found"));

        DonationStatus oldStatus = donation.getStatus();
        donation.setStatus(DonationStatus.SPOILED);
        donation.setSpoilageReportedAt(LocalDateTime.now());
        donationRepository.save(donation);

        // Record Food Safety Entry
        FoodSafetyRecord record = new FoodSafetyRecord();
        record.setDonation(donation);
        record.setReportedBy(user);
        record.setConditionAtReport(donation.getFoodCondition());
        record.setReason(request.getReason());
        record.setDescription(request.getDescription());
        record.setImageUrl(request.getImageUrl());
        record.setActionTaken("Marked as SPOILED and removed from redistribution pipeline");
        safetyRecordRepository.save(record);

        recordHistory(donation, oldStatus, DonationStatus.SPOILED, user.getName(), "Reported Spoiled: " + request.getReason());

        // Send alert notifications
        notificationService.createNotification(
                donation.getDonor(), donation, "FOOD SPOILAGE ALERT",
                "Donation #" + donation.getId() + " (" + donation.getFoodType() + ") was reported SPOILED: " + request.getReason(),
                "FOOD_SPOILED", Priority.EMERGENCY
        );

        if (donation.getVolunteer() != null) {
            notificationService.createNotification(
                    donation.getVolunteer(), donation, "FOOD SPOILAGE ALERT",
                    "Pickup for Donation #" + donation.getId() + " cancelled as food was reported SPOILED.",
                    "FOOD_SPOILED", Priority.EMERGENCY
            );
        }

        if (donation.getOrganization() != null) {
            notificationService.createNotification(
                    donation.getOrganization(), donation, "CRITICAL: SPOILED FOOD ALERT",
                    "Food for Donation #" + donation.getId() + " has been marked SPOILED. DO NOT DISTRIBUTE OR CONSUME.",
                    "FOOD_SPOILED", Priority.EMERGENCY
            );
        }

        return convertToResponse(donation);
    }

    public void recordHistory(Donation donation, DonationStatus oldStatus, DonationStatus newStatus, String changedBy, String remarks) {
        DonationHistory history = new DonationHistory(donation, oldStatus, newStatus, changedBy, remarks);
        historyRepository.save(history);
    }

    public DonationDtos.DonationResponse convertToResponse(Donation donation) {
        if (donation == null) return null;
        DonationDtos.DonationResponse response = new DonationDtos.DonationResponse();
        response.setId(donation.getId());
        response.setFoodType(donation.getFoodType());
        response.setFoodCategory(donation.getFoodCategory());
        response.setQuantity(donation.getQuantity());
        response.setUnit(donation.getUnit());
        response.setServings(donation.getServings());
        response.setFoodCondition(donation.getFoodCondition());
        response.setDietaryType(donation.getDietaryType());

        response.setPreparedAt(donation.getPreparedAt());
        response.setDonatedAt(donation.getDonatedAt());
        response.setExpiryAt(donation.getExpiryAt());

        response.setAssignedAt(donation.getAssignedAt());
        response.setPickupScheduledAt(donation.getPickupScheduledAt());
        response.setPickupStartedAt(donation.getPickupStartedAt());
        response.setArrivedAt(donation.getArrivedAt());
        response.setFoodCollectedAt(donation.getFoodCollectedAt());
        response.setDeliveryStartedAt(donation.getDeliveryStartedAt());
        response.setDeliveredAt(donation.getDeliveredAt());
        response.setSpoilageReportedAt(donation.getSpoilageReportedAt());

        response.setPickupAddress(donation.getPickupAddress());
        response.setLatitude(donation.getLatitude());
        response.setLongitude(donation.getLongitude());
        response.setImageUrl(donation.getImageUrl());
        response.setSpecialInstructions(donation.getSpecialInstructions());

        response.setStatus(donation.getStatus());
        response.setUrgencyLevel(donation.getUrgencyLevel());
        response.setRemainingSeconds(donation.getRemainingSeconds());

        response.setDonor(authService.convertToUserDto(donation.getDonor()));
        response.setVolunteer(authService.convertToUserDto(donation.getVolunteer()));
        response.setOrganization(authService.convertToUserDto(donation.getOrganization()));

        response.setCreatedAt(donation.getCreatedAt());
        response.setUpdatedAt(donation.getUpdatedAt());

        return response;
    }
}
