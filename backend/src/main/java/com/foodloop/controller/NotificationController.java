package com.foodloop.controller;

import com.foodloop.entity.Notification;
import com.foodloop.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @GetMapping
    public ResponseEntity<List<Notification>> getMyNotifications(Authentication authentication) {
        return ResponseEntity.ok(notificationService.getMyNotifications(authentication.getName()));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<Void> markAsRead(Authentication authentication, @PathVariable Long id) {
        notificationService.markAsRead(id, authentication.getName());
        return ResponseEntity.ok().build();
    }
}
