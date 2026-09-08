package com.foodloop.repository;

import com.foodloop.entity.DonationHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DonationHistoryRepository extends JpaRepository<DonationHistory, Long> {
    List<DonationHistory> findByDonationIdOrderByChangedAtAsc(Long donationId);
}
