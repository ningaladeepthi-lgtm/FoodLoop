package com.foodloop.dto;

import com.foodloop.enums.PickupStatus;
import java.time.LocalDateTime;

public class PickupDtos {

    public static class PickupResponse {
        private Long id;
        private DonationDtos.DonationResponse donation;
        private AuthDtos.UserDto volunteer;
        private RequestDtos.RequestResponse request;
        private LocalDateTime assignedAt;
        private LocalDateTime pickupScheduledAt;
        private LocalDateTime pickupStartedAt;
        private LocalDateTime arrivedAt;
        private LocalDateTime foodCollectedAt;
        private LocalDateTime deliveryStartedAt;
        private LocalDateTime deliveredAt;
        private PickupStatus status;
        private Double distanceKm;
        private String notes;

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }

        public DonationDtos.DonationResponse getDonation() { return donation; }
        public void setDonation(DonationDtos.DonationResponse donation) { this.donation = donation; }

        public AuthDtos.UserDto getVolunteer() { return volunteer; }
        public void setVolunteer(AuthDtos.UserDto volunteer) { this.volunteer = volunteer; }

        public RequestDtos.RequestResponse getRequest() { return request; }
        public void setRequest(RequestDtos.RequestResponse request) { this.request = request; }

        public LocalDateTime getAssignedAt() { return assignedAt; }
        public void setAssignedAt(LocalDateTime assignedAt) { this.assignedAt = assignedAt; }

        public LocalDateTime getPickupScheduledAt() { return pickupScheduledAt; }
        public void setPickupScheduledAt(LocalDateTime pickupScheduledAt) { this.pickupScheduledAt = pickupScheduledAt; }

        public LocalDateTime getPickupStartedAt() { return pickupStartedAt; }
        public void setPickupStartedAt(LocalDateTime pickupStartedAt) { this.pickupStartedAt = pickupStartedAt; }

        public LocalDateTime getArrivedAt() { return arrivedAt; }
        public void setArrivedAt(LocalDateTime arrivedAt) { this.arrivedAt = arrivedAt; }

        public LocalDateTime getFoodCollectedAt() { return foodCollectedAt; }
        public void setFoodCollectedAt(LocalDateTime foodCollectedAt) { this.foodCollectedAt = foodCollectedAt; }

        public LocalDateTime getDeliveryStartedAt() { return deliveryStartedAt; }
        public void setDeliveryStartedAt(LocalDateTime deliveryStartedAt) { this.deliveryStartedAt = deliveryStartedAt; }

        public LocalDateTime getDeliveredAt() { return deliveredAt; }
        public void setDeliveredAt(LocalDateTime deliveredAt) { this.deliveredAt = deliveredAt; }

        public PickupStatus getStatus() { return status; }
        public void setStatus(PickupStatus status) { this.status = status; }

        public Double getDistanceKm() { return distanceKm; }
        public void setDistanceKm(Double distanceKm) { this.distanceKm = distanceKm; }

        public String getNotes() { return notes; }
        public void setNotes(String notes) { this.notes = notes; }
    }
}
