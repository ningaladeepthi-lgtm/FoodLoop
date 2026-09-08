package com.foodloop.entity;

import com.foodloop.enums.DonationStatus;
import com.foodloop.enums.FoodCategory;
import com.foodloop.enums.UrgencyLevel;
import jakarta.persistence.*;
import java.time.Duration;
import java.time.LocalDateTime;

@Entity
@Table(name = "donations")
public class Donation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "donor_id", nullable = false)
    private User donor;

    @Column(nullable = false)
    private String foodType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FoodCategory foodCategory;

    @Column(nullable = false)
    private Double quantity;

    @Column(nullable = false)
    private String unit; // kg, servings, boxes, meals

    private Integer servings;

    private String foodCondition; // Fresh, Good, Needs Urgent Pickup
    private String dietaryType; // Veg, Non-Veg, Vegan

    private LocalDateTime preparedAt;
    private LocalDateTime donatedAt;
    private LocalDateTime expiryAt;
    
    // Timestamps lifecycle
    private LocalDateTime assignedAt;
    private LocalDateTime pickupScheduledAt;
    private LocalDateTime pickupStartedAt;
    private LocalDateTime arrivedAt;
    private LocalDateTime foodCollectedAt;
    private LocalDateTime deliveryStartedAt;
    private LocalDateTime deliveredAt;
    private LocalDateTime spoilageReportedAt;

    private String pickupAddress;
    private Double latitude;
    private Double longitude;

    private String imageUrl;
    private String specialInstructions;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DonationStatus status = DonationStatus.AVAILABLE;

    @ManyToOne
    @JoinColumn(name = "volunteer_id")
    private User volunteer;

    @ManyToOne
    @JoinColumn(name = "organization_id")
    private User organization;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.donatedAt == null) this.donatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public Donation() {}

    /**
     * Calculated field dynamically evaluating urgency level based on current system time
     */
    public UrgencyLevel getUrgencyLevel() {
        if (status == DonationStatus.EXPIRED || status == DonationStatus.SPOILED) {
            return UrgencyLevel.EXPIRED;
        }
        if (expiryAt == null) {
            return UrgencyLevel.FRESH;
        }
        LocalDateTime now = LocalDateTime.now();
        if (now.isAfter(expiryAt) || now.isEqual(expiryAt)) {
            return UrgencyLevel.EXPIRED;
        }
        long minutesRemaining = Duration.between(now, expiryAt).toMinutes();
        if (minutesRemaining <= 120) { // 2 hours
            return UrgencyLevel.URGENT;
        } else if (minutesRemaining <= 360) { // 6 hours
            return UrgencyLevel.EXPIRING_SOON;
        } else {
            return UrgencyLevel.FRESH;
        }
    }

    public long getRemainingSeconds() {
        if (expiryAt == null) return 0;
        long seconds = Duration.between(LocalDateTime.now(), expiryAt).toSeconds();
        return Math.max(0, seconds);
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getDonor() { return donor; }
    public void setDonor(User donor) { this.donor = donor; }

    public String getFoodType() { return foodType; }
    public void setFoodType(String foodType) { this.foodType = foodType; }

    public FoodCategory getFoodCategory() { return foodCategory; }
    public void setFoodCategory(FoodCategory foodCategory) { this.foodCategory = foodCategory; }

    public Double getQuantity() { return quantity; }
    public void setQuantity(Double quantity) { this.quantity = quantity; }

    public String getUnit() { return unit; }
    public void setUnit(String unit) { this.unit = unit; }

    public Integer getServings() { return servings; }
    public void setServings(Integer servings) { this.servings = servings; }

    public String getFoodCondition() { return foodCondition; }
    public void setFoodCondition(String foodCondition) { this.foodCondition = foodCondition; }

    public String getDietaryType() { return dietaryType; }
    public void setDietaryType(String dietaryType) { this.dietaryType = dietaryType; }

    public LocalDateTime getPreparedAt() { return preparedAt; }
    public void setPreparedAt(LocalDateTime preparedAt) { this.preparedAt = preparedAt; }

    public LocalDateTime getDonatedAt() { return donatedAt; }
    public void setDonatedAt(LocalDateTime donatedAt) { this.donatedAt = donatedAt; }

    public LocalDateTime getExpiryAt() { return expiryAt; }
    public void setExpiryAt(LocalDateTime expiryAt) { this.expiryAt = expiryAt; }

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

    public LocalDateTime getSpoilageReportedAt() { return spoilageReportedAt; }
    public void setSpoilageReportedAt(LocalDateTime spoilageReportedAt) { this.spoilageReportedAt = spoilageReportedAt; }

    public String getPickupAddress() { return pickupAddress; }
    public void setPickupAddress(String pickupAddress) { this.pickupAddress = pickupAddress; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getSpecialInstructions() { return specialInstructions; }
    public void setSpecialInstructions(String specialInstructions) { this.specialInstructions = specialInstructions; }

    public DonationStatus getStatus() { return status; }
    public void setStatus(DonationStatus status) { this.status = status; }

    public User getVolunteer() { return volunteer; }
    public void setVolunteer(User volunteer) { this.volunteer = volunteer; }

    public User getOrganization() { return organization; }
    public void setOrganization(User organization) { this.organization = organization; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
