package com.foodloop.service;

import com.foodloop.dto.AdminDtos;

import com.foodloop.dto.AuthDtos;

import com.foodloop.entity.Donation;
import com.foodloop.entity.FoodSafetyRecord;
import com.foodloop.entity.User;
import com.foodloop.enums.DonationStatus;
import com.foodloop.enums.FoodCategory;
import com.foodloop.enums.Role;
import com.foodloop.repository.DonationRepository;
import com.foodloop.repository.FoodSafetyRecordRepository;
import com.foodloop.repository.RequestRepository;
import com.foodloop.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AdminService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DonationRepository donationRepository;

    @Autowired
    private RequestRepository requestRepository;

    @Autowired
    private FoodSafetyRecordRepository safetyRecordRepository;

    @Autowired
    private AuthService authService;

    public AdminDtos.DashboardStatsDto getDashboardStats() {
        AdminDtos.DashboardStatsDto stats = new AdminDtos.DashboardStatsDto();

        stats.setTotalUsers(userRepository.count());
        stats.setTotalDonors(userRepository.countByRole(Role.DONOR));
        stats.setTotalVolunteers(userRepository.countByRole(Role.VOLUNTEER));
        stats.setTotalOrganizations(userRepository.countByRole(Role.ORGANIZATION));

        stats.setTotalDonations(donationRepository.count());
        stats.setActiveDonations(donationRepository.findByStatusIn(List.of(DonationStatus.AVAILABLE, DonationStatus.CLAIMED, DonationStatus.PICKUP_ASSIGNED, DonationStatus.PICKED_UP)).size());
        stats.setDeliveredDonations(donationRepository.countByStatus(DonationStatus.DELIVERED));
        stats.setExpiredDonations(donationRepository.countByStatus(DonationStatus.EXPIRED));
        stats.setSpoiledDonations(donationRepository.countByStatus(DonationStatus.SPOILED));

        Long servings = donationRepository.sumDeliveredServings();
        stats.setMealsRescued(servings != null ? servings : 0);

        Double kg = donationRepository.sumDeliveredQuantity();
        stats.setFoodSavedKg(kg != null ? Math.round(kg * 10.0) / 10.0 : 0.0);

        // Grouping by Category
        Map<String, Long> byCategory = new HashMap<>();
        for (FoodCategory cat : FoodCategory.values()) {
            byCategory.put(cat.name(), 0L);
        }
        List<Donation> all = donationRepository.findAll();
        for (Donation d : all) {
            byCategory.put(d.getFoodCategory().name(), byCategory.getOrDefault(d.getFoodCategory().name(), 0L) + 1);
        }
        stats.setDonationsByCategory(byCategory);

        // Grouping by Status
        Map<String, Long> byStatus = new HashMap<>();
        for (DonationStatus status : DonationStatus.values()) {
            byStatus.put(status.name(), 0L);
        }
        for (Donation d : all) {
            byStatus.put(d.getStatus().name(), byStatus.getOrDefault(d.getStatus().name(), 0L) + 1);
        }
        stats.setDonationsByStatus(byStatus);

        return stats;
    }

    public List<AuthDtos.UserDto> getAllUsers() {
        return userRepository.findAll().stream().map(authService::convertToUserDto).collect(Collectors.toList());
    }

    public AuthDtos.UserDto toggleUserStatus(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setActive(!user.isActive());
        User saved = userRepository.save(user);
        return authService.convertToUserDto(saved);
    }

    public List<FoodSafetyRecord> getFoodSafetyRecords() {
        return safetyRecordRepository.findAllByOrderByReportedAtDesc();
    }
}
