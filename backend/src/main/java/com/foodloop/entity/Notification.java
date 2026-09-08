package com.foodloop.entity;

import com.foodloop.enums.Priority;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "donation_id")
    private Donation donation;

    @ManyToOne
    @JoinColumn(name = "request_id")
    private Request request;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String message;

    private String type; // DONATION_CREATED, EXPIRING_SOON, URGENT_EXPIRY, FOOD_EXPIRED, FOOD_SPOILED, etc.

    @Enumerated(EnumType.STRING)
    private Priority priority = Priority.NORMAL;

    private boolean isRead = false;
    private LocalDateTime createdAt;
    private LocalDateTime readAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    public Notification() {}

    public Notification(User user, Donation donation, String title, String message, String type, Priority priority) {
        this.user = user;
        this.donation = donation;
        this.title = title;
        this.message = message;
        this.type = type;
        this.priority = priority;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Donation getDonation() { return donation; }
    public void setDonation(Donation donation) { this.donation = donation; }

    public Request getRequest() { return request; }
    public void setRequest(Request request) { this.request = request; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public Priority getPriority() { return priority; }
    public void setPriority(Priority priority) { this.priority = priority; }

    public boolean isRead() { return isRead; }
    public void setRead(boolean read) { 
        isRead = read;
        if (read && readAt == null) {
            readAt = LocalDateTime.now();
        }
    }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getReadAt() { return readAt; }
    public void setReadAt(LocalDateTime readAt) { this.readAt = readAt; }
}
