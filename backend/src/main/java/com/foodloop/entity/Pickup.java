package com.foodloop.entity;

import com.foodloop.enums.PickupStatus;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "pickups")
public class Pickup {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "donation_id", nullable = false)
    private Donation donation;

    @ManyToOne
    @JoinColumn(name = "volunteer_id", nullable = false)
    private User volunteer;

    @ManyToOne
    @JoinColumn(name = "request_id")
    private Request request;

    private LocalDateTime assignedAt;
    private LocalDateTime pickupScheduledAt;
    private LocalDateTime pickupStartedAt;
    private LocalDateTime arrivedAt;
    private LocalDateTime foodCollectedAt;
    private LocalDateTime deliveryStartedAt;
    private LocalDateTime deliveredAt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PickupStatus status = PickupStatus.ASSIGNED;

    private Double distanceKm = 1.5;
    private String notes;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.assignedAt == null) this.assignedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public Pickup() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Donation getDonation() { return donation; }
    public void setDonation(Donation donation) { this.donation = donation; }

    public User getVolunteer() { return volunteer; }
    public void setVolunteer(User volunteer) { this.volunteer = volunteer; }

    public Request getRequest() { return request; }
    public void setRequest(Request request) { this.request = request; }

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

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
