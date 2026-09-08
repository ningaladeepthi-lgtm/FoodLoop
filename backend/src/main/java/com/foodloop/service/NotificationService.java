package com.foodloop.service;

import com.foodloop.entity.Donation;
import com.foodloop.entity.Notification;
import com.foodloop.entity.User;
import com.foodloop.enums.Priority;
import com.foodloop.enums.Role;
import com.foodloop.repository.NotificationRepository;
import com.foodloop.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UserRepository userRepository;

    public void createNotification(User user, Donation donation, String title, String message, String type, Priority priority) {
        if (user == null) return;
        Notification notification = new Notification(user, donation, title, message, type, priority);
        notificationRepository.save(notification);
    }

    public void notifyVolunteersOfNewDonation(Donation donation) {
        List<User> volunteers = userRepository.findByRole(Role.VOLUNTEER);
        for (User volunteer : volunteers) {
            createNotification(
                    volunteer,
                    donation,
                    "NEW SURPLUS FOOD AVAILABLE",
                    donation.getDonor().getName() + " posted " + donation.getFoodType() + " (" + donation.getQuantity() + " " + donation.getUnit() + ") near " + donation.getPickupAddress(),
                    "DONATION_CREATED",
                    Priority.NORMAL
            );
        }
    }

    public List<Notification> getMyNotifications(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
    }

    public void markAsRead(Long id, String userEmail) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        notification.setRead(true);
        notificationRepository.save(notification);
    }
}
