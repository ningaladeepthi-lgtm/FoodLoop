package com.foodloop.repository;

import com.foodloop.entity.Pickup;
import com.foodloop.enums.PickupStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PickupRepository extends JpaRepository<Pickup, Long> {
    List<Pickup> findByVolunteerIdOrderByCreatedAtDesc(Long volunteerId);
    Optional<Pickup> findByDonationId(Long donationId);
    List<Pickup> findByStatus(PickupStatus status);
}
