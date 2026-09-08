package com.foodloop.service;

import com.foodloop.dto.PickupDtos;

import com.foodloop.entity.Donation;
import com.foodloop.entity.Pickup;
import com.foodloop.entity.Request;
import com.foodloop.entity.User;
import com.foodloop.enums.DonationStatus;
import com.foodloop.enums.PickupStatus;
import com.foodloop.enums.Priority;
import com.foodloop.enums.RequestStatus;
import com.foodloop.repository.DonationRepository;
import com.foodloop.repository.PickupRepository;
import com.foodloop.repository.RequestRepository;
import com.foodloop.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PickupService {

    @Autowired
    private PickupRepository pickupRepository;

    @Autowired
    private DonationRepository donationRepository;

    @Autowired
    private RequestRepository requestRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DonationService donationService;

    @Autowired
    private RequestService requestService;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private AuthService authService;

    /**
     * Enforce explicit safety rules before any pickup operation
     */
    private void validateFoodSafety(Donation donation) {
        if (donation.getStatus() == DonationStatus.EXPIRED || LocalDateTime.now().isAfter(donation.getExpiryAt())) {
            throw new RuntimeException("This food is no longer safe/available for redistribution because it has EXPIRED.");
        }
        if (donation.getStatus() == DonationStatus.SPOILED) {
            throw new RuntimeException("This food is no longer safe/available for redistribution because it has been reported SPOILED.");
        }
        if (donation.getStatus() == DonationStatus.CANCELLED) {
            throw new RuntimeException("This donation has been cancelled.");
        }
    }

    @Transactional
    public PickupDtos.PickupResponse acceptPickup(Long donationId, String volunteerEmail, Long requestId) {
        User volunteer = userRepository.findByEmail(volunteerEmail)
                .orElseThrow(() -> new RuntimeException("Volunteer not found"));
        Donation donation = donationRepository.findById(donationId)
                .orElseThrow(() -> new RuntimeException("Donation not found"));

        validateFoodSafety(donation);

        if (donation.getStatus() != DonationStatus.AVAILABLE) {
            throw new RuntimeException("This donation has already been assigned to another volunteer or claimed.");
        }

        DonationStatus oldStatus = donation.getStatus();
        donation.setStatus(DonationStatus.PICKUP_ASSIGNED);
        donation.setVolunteer(volunteer);
        donation.setAssignedAt(LocalDateTime.now());
        donation.setPickupScheduledAt(LocalDateTime.now().plusMinutes(45));

        Request request = null;
        if (requestId != null) {
            request = requestRepository.findById(requestId).orElse(null);
            if (request != null) {
                donation.setOrganization(request.getOrganization());
                request.setStatus(RequestStatus.PICKUP_ASSIGNED);
                request.setMatchedDonation(donation);
                requestRepository.save(request);
            }
        }

        donationRepository.save(donation);
        donationService.recordHistory(donation, oldStatus, DonationStatus.PICKUP_ASSIGNED, volunteer.getName(), "Volunteer accepted pickup");

        Pickup pickup = new Pickup();
        pickup.setDonation(donation);
        pickup.setVolunteer(volunteer);
        pickup.setRequest(request);
        pickup.setAssignedAt(LocalDateTime.now());
        pickup.setPickupScheduledAt(donation.getPickupScheduledAt());
        pickup.setStatus(PickupStatus.ASSIGNED);
        pickup.setDistanceKm(1.2 + (Math.random() * 2.5)); // Realistic distance simulation

        Pickup saved = pickupRepository.save(pickup);

        // Notifications
        notificationService.createNotification(
                donation.getDonor(), donation, "VOLUNTEER ACCEPTED PICKUP",
                volunteer.getName() + " accepted the pickup for donation #" + donation.getId(),
                "PICKUP_ASSIGNED", Priority.NORMAL
        );

        if (donation.getOrganization() != null) {
            notificationService.createNotification(
                    donation.getOrganization(), donation, "PICKUP ASSIGNED FOR YOUR REQUEST",
                    volunteer.getName() + " is assigned to deliver donation #" + donation.getId() + " to your organization.",
                    "PICKUP_ASSIGNED", Priority.NORMAL
            );
        }

        return convertToResponse(saved);
    }

    @Transactional
    public PickupDtos.PickupResponse updatePickupStatus(Long pickupId, String volunteerEmail, PickupStatus nextStatus) {
        User volunteer = userRepository.findByEmail(volunteerEmail)
                .orElseThrow(() -> new RuntimeException("Volunteer not found"));
        Pickup pickup = pickupRepository.findById(pickupId)
                .orElseThrow(() -> new RuntimeException("Pickup record not found"));

        Donation donation = pickup.getDonation();
        validateFoodSafety(donation);

        LocalDateTime now = LocalDateTime.now();
        DonationStatus oldDonationStatus = donation.getStatus();

        switch (nextStatus) {
            case PICKUP_STARTED:
                pickup.setPickupStartedAt(now);
                donation.setPickupStartedAt(now);
                pickup.setStatus(PickupStatus.PICKUP_STARTED);
                donationService.recordHistory(donation, oldDonationStatus, donation.getStatus(), volunteer.getName(), "Volunteer started journey to donor location");
                break;

            case ARRIVED_AT_DONOR:
                pickup.setArrivedAt(now);
                donation.setArrivedAt(now);
                pickup.setStatus(PickupStatus.ARRIVED_AT_DONOR);
                donationService.recordHistory(donation, oldDonationStatus, donation.getStatus(), volunteer.getName(), "Volunteer arrived at donor pickup location");
                break;

            case FOOD_COLLECTED:
                pickup.setFoodCollectedAt(now);
                donation.setFoodCollectedAt(now);
                donation.setStatus(DonationStatus.PICKED_UP);
                pickup.setStatus(PickupStatus.FOOD_COLLECTED);
                donationService.recordHistory(donation, oldDonationStatus, DonationStatus.PICKED_UP, volunteer.getName(), "Volunteer collected food from donor");
                
                notificationService.createNotification(
                        donation.getDonor(), donation, "FOOD COLLECTED",
                        "Volunteer " + volunteer.getName() + " has successfully collected food donation #" + donation.getId(),
                        "FOOD_COLLECTED", Priority.NORMAL
                );
                break;

            case DELIVERY_STARTED:
                pickup.setDeliveryStartedAt(now);
                donation.setDeliveryStartedAt(now);
                pickup.setStatus(PickupStatus.DELIVERY_STARTED);
                donationService.recordHistory(donation, oldDonationStatus, donation.getStatus(), volunteer.getName(), "Volunteer started transit to receiving organization");
                break;

            case DELIVERED:
                pickup.setDeliveredAt(now);
                donation.setDeliveredAt(now);
                donation.setStatus(DonationStatus.DELIVERED);
                pickup.setStatus(PickupStatus.DELIVERED);
                donationService.recordHistory(donation, oldDonationStatus, DonationStatus.DELIVERED, volunteer.getName(), "Food successfully delivered to recipient organization");

                if (pickup.getRequest() != null) {
                    pickup.getRequest().setStatus(RequestStatus.DELIVERED);
                    requestRepository.save(pickup.getRequest());
                }

                notificationService.createNotification(
                        donation.getDonor(), donation, "DONATION DELIVERED",
                        "Great news! Your food donation #" + donation.getId() + " has been delivered and served!",
                        "FOOD_DELIVERED", Priority.HIGH
                );

                if (donation.getOrganization() != null) {
                    notificationService.createNotification(
                            donation.getOrganization(), donation, "DELIVERY ARRIVED",
                            "Food donation #" + donation.getId() + " (" + donation.getFoodType() + ") has been delivered by " + volunteer.getName(),
                            "FOOD_DELIVERED", Priority.HIGH
                    );
                }
                break;

            default:
                break;
        }

        donationRepository.save(donation);
        Pickup saved = pickupRepository.save(pickup);
        return convertToResponse(saved);
    }

    public List<PickupDtos.PickupResponse> getMyPickups(String volunteerEmail) {
        User volunteer = userRepository.findByEmail(volunteerEmail)
                .orElseThrow(() -> new RuntimeException("Volunteer not found"));
        return pickupRepository.findByVolunteerIdOrderByCreatedAtDesc(volunteer.getId())
                .stream().map(this::convertToResponse).collect(Collectors.toList());
    }

    public PickupDtos.PickupResponse convertToResponse(Pickup pickup) {
        if (pickup == null) return null;
        PickupDtos.PickupResponse response = new PickupDtos.PickupResponse();
        response.setId(pickup.getId());
        response.setDonation(donationService.convertToResponse(pickup.getDonation()));
        response.setVolunteer(authService.convertToUserDto(pickup.getVolunteer()));
        response.setRequest(requestService.convertToResponse(pickup.getRequest()));
        response.setAssignedAt(pickup.getAssignedAt());
        response.setPickupScheduledAt(pickup.getPickupScheduledAt());
        response.setPickupStartedAt(pickup.getPickupStartedAt());
        response.setArrivedAt(pickup.getArrivedAt());
        response.setFoodCollectedAt(pickup.getFoodCollectedAt());
        response.setDeliveryStartedAt(pickup.getDeliveryStartedAt());
        response.setDeliveredAt(pickup.getDeliveredAt());
        response.setStatus(pickup.getStatus());
        response.setDistanceKm(pickup.getDistanceKm());
        response.setNotes(pickup.getNotes());
        return response;
    }
}
