package com.foodloop.scheduler;

import com.foodloop.entity.Donation;
import com.foodloop.enums.DonationStatus;
import com.foodloop.enums.Priority;
import com.foodloop.enums.UrgencyLevel;
import com.foodloop.repository.DonationRepository;
import com.foodloop.repository.NotificationRepository;
import com.foodloop.service.DonationService;
import com.foodloop.service.NotificationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;

@Component
public class FoodExpiryScheduler {

    private static final Logger logger = LoggerFactory.getLogger(FoodExpiryScheduler.class);

    @Autowired
    private DonationRepository donationRepository;

    @Autowired
    private DonationService donationService;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private NotificationRepository notificationRepository;

    /**
     * Scheduled job running every 60,000 milliseconds (1 minute)
     */
    @Scheduled(fixedRate = 60000)
    @Transactional
    public void processFoodExpiryAndUrgency() {
        LocalDateTime now = LocalDateTime.now();

        // 1. Process items that reached expiry date & set status to EXPIRED
        List<Donation> expiredDonations = donationRepository.findActiveDonationsThatExpired(now);
        for (Donation donation : expiredDonations) {
            DonationStatus oldStatus = donation.getStatus();
            donation.setStatus(DonationStatus.EXPIRED);
            donationRepository.save(donation);

            donationService.recordHistory(donation, oldStatus, DonationStatus.EXPIRED, "SYSTEM_SCHEDULER", "Automated system mark: Food reached expiry timestamp");

            // Notify Donor
            if (!notificationRepository.existsByUserIdAndDonationIdAndType(donation.getDonor().getId(), donation.getId(), "FOOD_EXPIRED")) {
                notificationService.createNotification(
                        donation.getDonor(), donation, "DONATION EXPIRED",
                        "Your donation #" + donation.getId() + " (" + donation.getFoodType() + ") has EXPIRED and is marked unavailable.",
                        "FOOD_EXPIRED", Priority.HIGH
                );
            }

            // Notify assigned Volunteer if any
            if (donation.getVolunteer() != null && !notificationRepository.existsByUserIdAndDonationIdAndType(donation.getVolunteer().getId(), donation.getId(), "FOOD_EXPIRED")) {
                notificationService.createNotification(
                        donation.getVolunteer(), donation, "PICKUP CANCELLED - EXPIRED",
                        "Assigned donation #" + donation.getId() + " has EXPIRED and cannot be collected.",
                        "FOOD_EXPIRED", Priority.HIGH
                );
            }

            // Notify assigned Organization if any
            if (donation.getOrganization() != null && !notificationRepository.existsByUserIdAndDonationIdAndType(donation.getOrganization().getId(), donation.getId(), "FOOD_EXPIRED")) {
                notificationService.createNotification(
                        donation.getOrganization(), donation, "MATCHED DONATION EXPIRED",
                        "Matched donation #" + donation.getId() + " has EXPIRED and will not be delivered.",
                        "FOOD_EXPIRED", Priority.HIGH
                );
            }
        }

        // 2. Process Urgency alerts for available donations
        List<Donation> activeAvailable = donationRepository.findAvailableAndNotExpired(now);
        for (Donation donation : activeAvailable) {
            long minutesRemaining = Duration.between(now, donation.getExpiryAt()).toMinutes();

            // URGENT ALERT (< 2 hours remaining)
            if (minutesRemaining <= 120 && minutesRemaining > 0) {
                if (!notificationRepository.existsByUserIdAndDonationIdAndType(donation.getDonor().getId(), donation.getId(), "URGENT_EXPIRY")) {
                    notificationService.createNotification(
                            donation.getDonor(), donation, "⚠️ URGENT FOOD ALERT",
                            "Donation #" + donation.getId() + " (" + donation.getFoodType() + ") expires in less than 2 hours! Pickup required immediately.",
                            "URGENT_EXPIRY", Priority.EMERGENCY
                    );
                }
            }
            // EXPIRING SOON ALERT (2 to 6 hours remaining)
            else if (minutesRemaining <= 360 && minutesRemaining > 120) {
                if (!notificationRepository.existsByUserIdAndDonationIdAndType(donation.getDonor().getId(), donation.getId(), "EXPIRING_SOON")) {
                    notificationService.createNotification(
                            donation.getDonor(), donation, "FOOD EXPIRING SOON",
                            "Donation #" + donation.getId() + " (" + donation.getFoodType() + ") expires in " + (minutesRemaining / 60) + " hours.",
                            "EXPIRING_SOON", Priority.NORMAL
                    );
                }
            }
        }
    }
}
