package com.foodloop.repository;

import com.foodloop.entity.Request;
import com.foodloop.enums.RequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RequestRepository extends JpaRepository<Request, Long> {
    List<Request> findByOrganizationIdOrderByCreatedAtDesc(Long organizationId);
    List<Request> findByStatus(RequestStatus status);
    long countByStatus(RequestStatus status);
}
