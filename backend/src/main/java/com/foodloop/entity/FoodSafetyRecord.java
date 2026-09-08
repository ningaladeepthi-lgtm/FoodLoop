package com.foodloop.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "food_safety_records")
public class FoodSafetyRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "donation_id", nullable = false)
    private Donation donation;

    @ManyToOne
    @JoinColumn(name = "reported_by_id", nullable = false)
    private User reportedBy;

    private String conditionAtReport;

    @Column(nullable = false)
    private String reason; // Bad smell, Changed appearance, Improper storage, Temperature issue, Damaged packaging, Contamination, Other

    @Column(columnDefinition = "TEXT")
    private String description;

    private String imageUrl;
    private String actionTaken;

    private LocalDateTime reportedAt;

    @PrePersist
    protected void onCreate() {
        this.reportedAt = LocalDateTime.now();
    }

    public FoodSafetyRecord() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Donation getDonation() { return donation; }
    public void setDonation(Donation donation) { this.donation = donation; }

    public User getReportedBy() { return reportedBy; }
    public void setReportedBy(User reportedBy) { this.reportedBy = reportedBy; }

    public String getConditionAtReport() { return conditionAtReport; }
    public void setConditionAtReport(String conditionAtReport) { this.conditionAtReport = conditionAtReport; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getActionTaken() { return actionTaken; }
    public void setActionTaken(String actionTaken) { this.actionTaken = actionTaken; }

    public LocalDateTime getReportedAt() { return reportedAt; }
    public void setReportedAt(LocalDateTime reportedAt) { this.reportedAt = reportedAt; }
}
