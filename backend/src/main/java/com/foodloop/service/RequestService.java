package com.foodloop.service;

import com.foodloop.dto.DonationDtos;
import com.foodloop.dto.RequestDtos;
import com.foodloop.entity.Donation;
import com.foodloop.entity.Request;
import com.foodloop.entity.User;
import com.foodloop.enums.DonationStatus;
import com.foodloop.enums.Priority;
import com.foodloop.enums.RequestStatus;
import com.foodloop.repository.DonationRepository;
import com.foodloop.repository.RequestRepository;
import com.foodloop.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class RequestService {

    @Autowired
    private RequestRepository requestRepository;

    @Autowired
    private DonationRepository donationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DonationService donationService;

    @Autowired
    private AuthService authService;

    @Transactional
    public RequestDtos.RequestResponse createRequest(String orgEmail, RequestDtos.CreateRequestRequest dto) {
        User org = userRepository.findByEmail(orgEmail)
                .orElseThrow(() -> new RuntimeException("Organization not found"));

        Request request = new Request();
        request.setOrganization(org);
        request.setFoodType(dto.getFoodType());
        request.setQuantityRequired(dto.getQuantityRequired());
        request.setPeopleCount(dto.getPeopleCount() != null ? dto.getPeopleCount() : (int)(dto.getQuantityRequired() * 2));
        request.setPriority(dto.getPriority() != null ? dto.getPriority() : Priority.NORMAL);
        request.setRequiredBefore(dto.getRequiredBefore() != null ? dto.getRequiredBefore() : LocalDateTime.now().plusHours(4));
        request.setLocation(dto.getLocation() != null ? dto.getLocation() : org.getAddress());
        request.setLatitude(dto.getLatitude() != null ? dto.getLatitude() : 17.3850);
        request.setLongitude(dto.getLongitude() != null ? dto.getLongitude() : 78.4867);
        request.setAdditionalRequirements(dto.getAdditionalRequirements());
        request.setStatus(RequestStatus.PENDING);

        Request saved = requestRepository.save(request);
        return convertToResponse(saved);
    }

    public List<RequestDtos.RequestResponse> getMyRequests(String orgEmail) {
        User org = userRepository.findByEmail(orgEmail)
                .orElseThrow(() -> new RuntimeException("Organization not found"));
        return requestRepository.findByOrganizationIdOrderByCreatedAtDesc(org.getId())
                .stream().map(this::convertToResponse).collect(Collectors.toList());
    }

    public List<RequestDtos.RequestResponse> getAllRequests() {
        return requestRepository.findAll().stream()
                .sorted(Comparator.comparing(Request::getCreatedAt).reversed())
                .map(this::convertToResponse).collect(Collectors.toList());
    }

    /**
     * Smart Recommended Food Match algorithm
     */
    public List<DonationDtos.DonationResponse> getRecommendedMatchesForRequest(Long requestId) {
        Request request = requestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        LocalDateTime now = LocalDateTime.now();
        List<Donation> available = donationRepository.findAvailableAndNotExpired(now);

        return available.stream()
                .filter(d -> d.getStatus() == DonationStatus.AVAILABLE)
                .sorted(Comparator.comparing((Donation d) -> {
                    // Match category or food type similarity
                    boolean categoryMatch = d.getFoodType().toLowerCase().contains(request.getFoodType().toLowerCase()) ||
                            request.getFoodType().toLowerCase().contains(d.getFoodType().toLowerCase());
                    return categoryMatch ? 0 : 1;
                }).thenComparing(Donation::getExpiryAt)) // Earlier expiry prioritized
                .map(donationService::convertToResponse)
                .collect(Collectors.toList());
    }

    public RequestDtos.RequestResponse convertToResponse(Request request) {
        if (request == null) return null;
        RequestDtos.RequestResponse response = new RequestDtos.RequestResponse();
        response.setId(request.getId());
        response.setOrganization(authService.convertToUserDto(request.getOrganization()));
        response.setFoodType(request.getFoodType());
        response.setQuantityRequired(request.getQuantityRequired());
        response.setPeopleCount(request.getPeopleCount());
        response.setPriority(request.getPriority());
        response.setRequiredBefore(request.getRequiredBefore());
        response.setLocation(request.getLocation());
        response.setLatitude(request.getLatitude());
        response.setLongitude(request.getLongitude());
        response.setAdditionalRequirements(request.getAdditionalRequirements());
        response.setStatus(request.getStatus());
        if (request.getMatchedDonation() != null) {
            response.setMatchedDonation(donationService.convertToResponse(request.getMatchedDonation()));
        }
        response.setCreatedAt(request.getCreatedAt());
        response.setUpdatedAt(request.getUpdatedAt());
        return response;
    }
}
