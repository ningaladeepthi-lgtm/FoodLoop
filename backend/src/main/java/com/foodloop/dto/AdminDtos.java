package com.foodloop.dto;

import java.util.Map;

public class AdminDtos {

    public static class DashboardStatsDto {
        private long totalUsers;
        private long totalDonors;
        private long totalVolunteers;
        private long totalOrganizations;

        private long totalDonations;
        private long activeDonations;
        private long deliveredDonations;
        private long expiredDonations;
        private long spoiledDonations;

        private long mealsRescued;
        private double foodSavedKg;

        private Map<String, Long> donationsByCategory;
        private Map<String, Long> donationsByStatus;

        public long getTotalUsers() { return totalUsers; }
        public void setTotalUsers(long totalUsers) { this.totalUsers = totalUsers; }

        public long getTotalDonors() { return totalDonors; }
        public void setTotalDonors(long totalDonors) { this.totalDonors = totalDonors; }

        public long getTotalVolunteers() { return totalVolunteers; }
        public void setTotalVolunteers(long totalVolunteers) { this.totalVolunteers = totalVolunteers; }

        public long getTotalOrganizations() { return totalOrganizations; }
        public void setTotalOrganizations(long totalOrganizations) { this.totalOrganizations = totalOrganizations; }

        public long getTotalDonations() { return totalDonations; }
        public void setTotalDonations(long totalDonations) { this.totalDonations = totalDonations; }

        public long getActiveDonations() { return activeDonations; }
        public void setActiveDonations(long activeDonations) { this.activeDonations = activeDonations; }

        public long getDeliveredDonations() { return deliveredDonations; }
        public void setDeliveredDonations(long deliveredDonations) { this.deliveredDonations = deliveredDonations; }

        public long getExpiredDonations() { return expiredDonations; }
        public void setExpiredDonations(long expiredDonations) { this.expiredDonations = expiredDonations; }

        public long getSpoiledDonations() { return spoiledDonations; }
        public void setSpoiledDonations(long spoiledDonations) { this.spoiledDonations = spoiledDonations; }

        public long getMealsRescued() { return mealsRescued; }
        public void setMealsRescued(long mealsRescued) { this.mealsRescued = mealsRescued; }

        public double getFoodSavedKg() { return foodSavedKg; }
        public void setFoodSavedKg(double foodSavedKg) { this.foodSavedKg = foodSavedKg; }

        public Map<String, Long> getDonationsByCategory() { return donationsByCategory; }
        public void setDonationsByCategory(Map<String, Long> donationsByCategory) { this.donationsByCategory = donationsByCategory; }

        public Map<String, Long> getDonationsByStatus() { return donationsByStatus; }
        public void setDonationsByStatus(Map<String, Long> donationsByStatus) { this.donationsByStatus = donationsByStatus; }
    }
}
