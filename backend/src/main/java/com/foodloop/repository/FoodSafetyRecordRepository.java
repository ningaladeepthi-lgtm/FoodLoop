package com.foodloop.repository;

import com.foodloop.entity.FoodSafetyRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FoodSafetyRecordRepository extends JpaRepository<FoodSafetyRecord, Long> {
    List<FoodSafetyRecord> findByDonationId(Long donationId);
    List<FoodSafetyRecord> findAllByOrderByReportedAtDesc();
}
