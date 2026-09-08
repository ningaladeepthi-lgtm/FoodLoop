package com.foodloop.repository;

import com.foodloop.entity.Donation;
import com.foodloop.enums.DonationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface DonationRepository extends JpaRepository<Donation, Long> {
    List<Donation> findByDonorIdOrderByCreatedAtDesc(Long donorId);
    List<Donation> findByVolunteerIdOrderByCreatedAtDesc(Long volunteerId);
    List<Donation> findByOrganizationIdOrderByCreatedAtDesc(Long organizationId);
    List<Donation> findByStatus(DonationStatus status);
    List<Donation> findByStatusIn(List<DonationStatus> statuses);

    @Query("SELECT d FROM Donation d WHERE d.status = 'AVAILABLE' AND d.expiryAt > :now ORDER BY d.expiryAt ASC")
    List<Donation> findAvailableAndNotExpired(@Param("now") LocalDateTime now);

    @Query("SELECT d FROM Donation d WHERE d.status NOT IN ('EXPIRED', 'SPOILED', 'CANCELLED', 'DELIVERED') AND d.expiryAt <= :now")
    List<Donation> findActiveDonationsThatExpired(@Param("now") LocalDateTime now);

    long countByStatus(DonationStatus status);
    
    @Query("SELECT SUM(d.servings) FROM Donation d WHERE d.status = 'DELIVERED'")
    Long sumDeliveredServings();

    @Query("SELECT SUM(d.quantity) FROM Donation d WHERE d.status = 'DELIVERED'")
    Double sumDeliveredQuantity();

    @Query("SELECT SUM(d.quantity) FROM Donation d WHERE d.status NOT IN ('EXPIRED', 'SPOILED')")
    Double sumRescuedQuantity();
}
