package com.foodloop.service;

import com.foodloop.dto.AuthDtos;
import com.foodloop.entity.User;
import com.foodloop.repository.UserRepository;
import com.foodloop.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenProvider tokenProvider;

    public AuthDtos.JwtResponse login(AuthDtos.LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.isActive()) {
            throw new RuntimeException("User account has been deactivated.");
        }

        String jwt = tokenProvider.generateToken(authentication);
        return new AuthDtos.JwtResponse(jwt, user.getId(), user.getName(), user.getEmail(), user.getRole());
    }

    public AuthDtos.UserDto register(AuthDtos.RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email address already registered!");
        }

        User user = new User(
                request.getName(),
                request.getEmail(),
                request.getPhone(),
                passwordEncoder.encode(request.getPassword()),
                request.getRole()
        );

        if (request.getOrganizationName() != null) user.setOrganizationName(request.getOrganizationName());
        if (request.getOrganizationType() != null) user.setOrganizationType(request.getOrganizationType());
        if (request.getAddress() != null) user.setAddress(request.getAddress());
        if (request.getContactPerson() != null) user.setContactPerson(request.getContactPerson());
        if (request.getRequiredFoodCategories() != null) user.setRequiredFoodCategories(request.getRequiredFoodCategories());

        User savedUser = userRepository.save(user);

        return convertToUserDto(savedUser);
    }

    public AuthDtos.UserDto getCurrentUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return convertToUserDto(user);
    }

    public AuthDtos.UserDto convertToUserDto(User user) {
        if (user == null) return null;
        return new AuthDtos.UserDto(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getPhone(),
                user.getRole(),
                user.getOrganizationName(),
                user.getOrganizationType(),
                user.getAddress(),
                user.isActive()
        );
    }
}
