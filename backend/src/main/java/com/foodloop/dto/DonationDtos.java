package com.foodloop.dto;

import com.foodloop.enums.DonationStatus;
import com.foodloop.enums.FoodCategory;
import com.foodloop.enums.UrgencyLevel;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

public class DonationDtos {

    public static class CreateDonationRequest {
        @NotBlank
        private String foodType;

        @NotNull
        private FoodCategory foodCategory;

        @NotNull
        private Double quantity;

        @NotBlank
        private String unit;

        private Integer servings;
        private String foodCondition;
        private String dietaryType;

        private LocalDateTime preparedAt;
        private LocalDateTime expiryAt;

        @NotBlank
        private String pickupAddress;

        private Double latitude;
        private Double longitude;
        private String imageUrl;
        private String specialInstructions;

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

        public LocalDateTime getExpiryAt() { return expiryAt; }
        public void setExpiryAt(LocalDateTime expiryAt) { this.expiryAt = expiryAt; }

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
    }

    public static class SpoilageReportRequest {
        @NotBlank
        private String reason; // Bad smell, Changed appearance, Improper storage, Temperature issue, Damaged packaging, Contamination, Other
        
        private String description;
        private String imageUrl;

        public String getReason() { return reason; }
        public void setReason(String reason) { this.reason = reason; }

        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }

        public String getImageUrl() { return imageUrl; }
        public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    }

    public static class DonationResponse {
        private Long id;
        private String foodType;
        private FoodCategory foodCategory;
        private Double quantity;
        private String unit;
        private Integer servings;
        private String foodCondition;
        private String dietaryType;

        private LocalDateTime preparedAt;
        private LocalDateTime donatedAt;
        private LocalDateTime expiryAt;
        
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

        private DonationStatus status;
        private UrgencyLevel urgencyLevel;
        private long remainingSeconds;

        private AuthDtos.UserDto donor;
        private AuthDtos.UserDto volunteer;
        private AuthDtos.UserDto organization;

        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }

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

        public UrgencyLevel getUrgencyLevel() { return urgencyLevel; }
        public void setUrgencyLevel(UrgencyLevel urgencyLevel) { this.urgencyLevel = urgencyLevel; }

        public long getRemainingSeconds() { return remainingSeconds; }
        public void setRemainingSeconds(long remainingSeconds) { this.remainingSeconds = remainingSeconds; }

        public AuthDtos.UserDto getDonor() { return donor; }
        public void setDonor(AuthDtos.UserDto donor) { this.donor = donor; }

        public AuthDtos.UserDto getVolunteer() { return volunteer; }
        public void setVolunteer(AuthDtos.UserDto volunteer) { this.volunteer = volunteer; }

        public AuthDtos.UserDto getOrganization() { return organization; }
        public void setOrganization(AuthDtos.UserDto organization) { this.organization = organization; }

        public LocalDateTime getCreatedAt() { return createdAt; }
        public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

        public LocalDateTime getUpdatedAt() { return updatedAt; }
        public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    }
}
