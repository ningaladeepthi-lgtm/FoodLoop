package com.foodloop.dto;

import com.foodloop.enums.Priority;
import com.foodloop.enums.RequestStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

public class RequestDtos {

    public static class CreateRequestRequest {
        @NotBlank
        private String foodType;

        @NotNull
        private Double quantityRequired;

        private Integer peopleCount;
        private Priority priority = Priority.NORMAL;
        private LocalDateTime requiredBefore;

        @NotBlank
        private String location;
        private Double latitude;
        private Double longitude;
        private String additionalRequirements;

        public String getFoodType() { return foodType; }
        public void setFoodType(String foodType) { this.foodType = foodType; }

        public Double getQuantityRequired() { return quantityRequired; }
        public void setQuantityRequired(Double quantityRequired) { this.quantityRequired = quantityRequired; }

        public Integer getPeopleCount() { return peopleCount; }
        public void setPeopleCount(Integer peopleCount) { this.peopleCount = peopleCount; }

        public Priority getPriority() { return priority; }
        public void setPriority(Priority priority) { this.priority = priority; }

        public LocalDateTime getRequiredBefore() { return requiredBefore; }
        public void setRequiredBefore(LocalDateTime requiredBefore) { this.requiredBefore = requiredBefore; }

        public String getLocation() { return location; }
        public void setLocation(String location) { this.location = location; }

        public Double getLatitude() { return latitude; }
        public void setLatitude(Double latitude) { this.latitude = latitude; }

        public Double getLongitude() { return longitude; }
        public void setLongitude(Double longitude) { this.longitude = longitude; }

        public String getAdditionalRequirements() { return additionalRequirements; }
        public void setAdditionalRequirements(String additionalRequirements) { this.additionalRequirements = additionalRequirements; }
    }

    public static class RequestResponse {
        private Long id;
        private AuthDtos.UserDto organization;
        private String foodType;
        private Double quantityRequired;
        private Integer peopleCount;
        private Priority priority;
        private LocalDateTime requiredBefore;
        private String location;
        private Double latitude;
        private Double longitude;
        private String additionalRequirements;
        private RequestStatus status;
        private DonationDtos.DonationResponse matchedDonation;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }

        public AuthDtos.UserDto getOrganization() { return organization; }
        public void setOrganization(AuthDtos.UserDto organization) { this.organization = organization; }

        public String getFoodType() { return foodType; }
        public void setFoodType(String foodType) { this.foodType = foodType; }

        public Double getQuantityRequired() { return quantityRequired; }
        public void setQuantityRequired(Double quantityRequired) { this.quantityRequired = quantityRequired; }

        public Integer getPeopleCount() { return peopleCount; }
        public void setPeopleCount(Integer peopleCount) { this.peopleCount = peopleCount; }

        public Priority getPriority() { return priority; }
        public void setPriority(Priority priority) { this.priority = priority; }

        public LocalDateTime getRequiredBefore() { return requiredBefore; }
        public void setRequiredBefore(LocalDateTime requiredBefore) { this.requiredBefore = requiredBefore; }

        public String getLocation() { return location; }
        public void setLocation(String location) { this.location = location; }

        public Double getLatitude() { return latitude; }
        public void setLatitude(Double latitude) { this.latitude = latitude; }

        public Double getLongitude() { return longitude; }
        public void setLongitude(Double longitude) { this.longitude = longitude; }

        public String getAdditionalRequirements() { return additionalRequirements; }
        public void setAdditionalRequirements(String additionalRequirements) { this.additionalRequirements = additionalRequirements; }

        public RequestStatus getStatus() { return status; }
        public void setStatus(RequestStatus status) { this.status = status; }

        public DonationDtos.DonationResponse getMatchedDonation() { return matchedDonation; }
        public void setMatchedDonation(DonationDtos.DonationResponse matchedDonation) { this.matchedDonation = matchedDonation; }

        public LocalDateTime getCreatedAt() { return createdAt; }
        public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

        public LocalDateTime getUpdatedAt() { return updatedAt; }
        public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    }
}
