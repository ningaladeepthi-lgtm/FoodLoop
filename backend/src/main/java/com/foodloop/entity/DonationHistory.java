package com.foodloop.entity;

import com.foodloop.enums.DonationStatus;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "donation_history")
public class DonationHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "donation_id", nullable = false)
    private Donation donation;

    @Enumerated(EnumType.STRING)
    private DonationStatus previousStatus;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DonationStatus newStatus;

    private String changedBy; // User Name or SYSTEM
    private LocalDateTime changedAt;
    private String remarks;

    @PrePersist
    protected void onCreate() {
        this.changedAt = LocalDateTime.now();
    }

    public DonationHistory() {}

    public DonationHistory(Donation donation, DonationStatus previousStatus, DonationStatus newStatus, String changedBy, String remarks) {
        this.donation = donation;
        this.previousStatus = previousStatus;
        this.newStatus = newStatus;
        this.changedBy = changedBy;
        this.remarks = remarks;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Donation getDonation() { return donation; }
    public void setDonation(Donation donation) { this.donation = donation; }

    public DonationStatus getPreviousStatus() { return previousStatus; }
    public void setPreviousStatus(DonationStatus previousStatus) { this.previousStatus = previousStatus; }

    public DonationStatus getNewStatus() { return newStatus; }
    public void setNewStatus(DonationStatus newStatus) { this.newStatus = newStatus; }

    public String getChangedBy() { return changedBy; }
    public void setChangedBy(String changedBy) { this.changedBy = changedBy; }

    public LocalDateTime getChangedAt() { return changedAt; }
    public void setChangedAt(LocalDateTime changedAt) { this.changedAt = changedAt; }

    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }
}
