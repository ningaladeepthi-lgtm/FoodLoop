package com.foodloop.dto;

import com.foodloop.enums.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class AuthDtos {

    public static class LoginRequest {
        @NotBlank @Email
        private String email;

        @NotBlank
        private String password;

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    public static class RegisterRequest {
        @NotBlank
        private String name;

        @NotBlank @Email
        private String email;

        @NotBlank
        private String phone;

        @NotBlank
        private String password;

        @NotNull
        private Role role;

        private String organizationName;
        private String organizationType;
        private String address;
        private String contactPerson;
        private String requiredFoodCategories;

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public String getPhone() { return phone; }
        public void setPhone(String phone) { this.phone = phone; }

        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }

        public Role getRole() { return role; }
        public void setRole(Role role) { this.role = role; }

        public String getOrganizationName() { return organizationName; }
        public void setOrganizationName(String organizationName) { this.organizationName = organizationName; }

        public String getOrganizationType() { return organizationType; }
        public void setOrganizationType(String organizationType) { this.organizationType = organizationType; }

        public String getAddress() { return address; }
        public void setAddress(String address) { this.address = address; }

        public String getContactPerson() { return contactPerson; }
        public void setContactPerson(String contactPerson) { this.contactPerson = contactPerson; }

        public String getRequiredFoodCategories() { return requiredFoodCategories; }
        public void setRequiredFoodCategories(String requiredFoodCategories) { this.requiredFoodCategories = requiredFoodCategories; }
    }

    public static class JwtResponse {
        private String token;
        private String type = "Bearer";
        private Long id;
        private String name;
        private String email;
        private Role role;

        public JwtResponse(String token, Long id, String name, String email, Role role) {
            this.token = token;
            this.id = id;
            this.name = name;
            this.email = email;
            this.role = role;
        }

        public String getToken() { return token; }
        public String getType() { return type; }
        public Long getId() { return id; }
        public String getName() { return name; }
        public String getEmail() { return email; }
        public Role getRole() { return role; }
    }

    public static class UserDto {
        private Long id;
        private String name;
        private String email;
        private String phone;
        private Role role;
        private String organizationName;
        private String organizationType;
        private String address;
        private boolean active;

        public UserDto() {}

        public UserDto(Long id, String name, String email, String phone, Role role, String organizationName, String organizationType, String address, boolean active) {
            this.id = id;
            this.name = name;
            this.email = email;
            this.phone = phone;
            this.role = role;
            this.organizationName = organizationName;
            this.organizationType = organizationType;
            this.address = address;
            this.active = active;
        }

        public Long getId() { return id; }
        public String getName() { return name; }
        public String getEmail() { return email; }
        public String getPhone() { return phone; }
        public Role getRole() { return role; }
        public String getOrganizationName() { return organizationName; }
        public String getOrganizationType() { return organizationType; }
        public String getAddress() { return address; }
        public boolean isActive() { return active; }
    }
}
