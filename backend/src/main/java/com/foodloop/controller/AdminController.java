package com.foodloop.controller;

import com.foodloop.dto.AdminDtos;
import com.foodloop.dto.AuthDtos;
import com.foodloop.entity.FoodSafetyRecord;
import com.foodloop.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @GetMapping("/dashboard")
    public ResponseEntity<AdminDtos.DashboardStatsDto> getDashboardStats() {
        return ResponseEntity.ok(adminService.getDashboardStats());
    }

    @GetMapping("/users")
    public ResponseEntity<List<AuthDtos.UserDto>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @PutMapping("/users/{id}/toggle-status")
    public ResponseEntity<AuthDtos.UserDto> toggleUserStatus(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.toggleUserStatus(id));
    }

    @GetMapping("/food-safety")
    public ResponseEntity<List<FoodSafetyRecord>> getFoodSafetyRecords() {
        return ResponseEntity.ok(adminService.getFoodSafetyRecords());
    }
}
