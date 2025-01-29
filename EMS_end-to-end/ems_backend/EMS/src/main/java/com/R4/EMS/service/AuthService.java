package com.R4.EMS.service;

import com.R4.EMS.entity.Employee;
import com.R4.EMS.exception.InvalidCredentialsException;
import com.R4.EMS.exception.UserDisabledException;
import com.R4.EMS.repository.UserRepository;
import com.R4.EMS.security.JwtIssuer;
import com.R4.EMS.security.SecurityUser;
import com.R4.EMS.security.role.Roles;
import com.R4.generated.dto.*;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtIssuer jwtIssuer;

    public AuthResponse login(LoginDto loginDto) {
        logger.debug("Login request received for email: {}", loginDto.getUsernameOrEmail());

        Optional<SecurityUser> userOpt = userRepository.findByEmail(loginDto.getUsernameOrEmail());
        if (userOpt.isEmpty()) {
            logger.error("User not found with email: {}", loginDto.getUsernameOrEmail());
            throw new InvalidCredentialsException("Username or password don't match up");
        }

        SecurityUser user = userOpt.get();

        if (!user.isEnabled()) {
            logger.error("User account is disabled for email: {}", loginDto.getUsernameOrEmail());
            throw new UserDisabledException("User account is disabled");
        }

        if (!passwordEncoder.matches(loginDto.getPassword(), user.getPassword())) {
            logger.error("Invalid credentials for email: {}", loginDto.getUsernameOrEmail());
            throw new InvalidCredentialsException("Username or password don't match up");
        }

        String role = user.getRole().name();
        String token = jwtIssuer.issue(user.getId(), user.getEmail(), role);
        logger.debug("JWT token issued: {}", token);

        return new AuthResponse(token, user.getId().toString());
    }

    @Transactional
    public UserDto signup(SignUpDto signUpDto) {
        logger.debug("Sign-up request received: {}", signUpDto);

        // Validate password strength
        if (signUpDto.getPassword().length() < 6) {
            logger.error("Password is too weak");
            throw new IllegalArgumentException("Password is too weak");
        }

        // Check if email already exists
        if (userRepository.findByEmail(signUpDto.getEmail()).isPresent()) {
            logger.error("Email already in use: {}", signUpDto.getEmail());
            throw new IllegalStateException("Email already in use");
        }

        // Check if role is null
        if (signUpDto.getRole() == null) {
            logger.error("Role cannot be null");
            throw new IllegalArgumentException("Role cannot be null");
        }

        // Generate a UUID for both user and employee
        UUID userId = UUID.randomUUID();

        // Create a new SecurityUser instance and set its properties
        SecurityUser user = new SecurityUser();
        user.setId(userId); // Set the user ID
        user.setFirstName(signUpDto.getFirstName());
        user.setLastName(signUpDto.getLastName());
        user.setEmail(signUpDto.getEmail());
        user.setPassword(passwordEncoder.encode(signUpDto.getPassword()));
        user.setEnabled(true);

        // Convert DTO Roles to SecurityRoles
        Roles userRole = Roles.valueOf(signUpDto.getRole().name());
        user.setRole(userRole);

        // Create and populate Employee entity with the same ID
        Employee employee = new Employee();
        employee.setId(userId); // Set the employee ID to match the user ID
        employee.setFirstName(signUpDto.getFirstName());
        employee.setLastName(signUpDto.getLastName());
        employee.setEmail(signUpDto.getEmail());
        employee.setRole(signUpDto.getRole());
        user.setEmployee(employee);

        // Save the user entity, which will cascade to save the employee entity
        userRepository.save(user);

        // Create and populate UserDto
        UserDto userDto = new UserDto();
        userDto.setId(user.getId());
        userDto.setEmail(user.getEmail());
        userDto.setFirstName(user.getFirstName());
        userDto.setLastName(user.getLastName());

        // Convert SecurityRoles to DTO Roles
        com.R4.generated.dto.Roles dtoRole = com.R4.generated.dto.Roles.valueOf(userRole.name());
        userDto.setRole(dtoRole);

        // Log the creation
        logger.debug("User created: {}", userDto);

        // Return the UserDto
        return userDto;
    }


    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AuthResponse {
        private String jwtToken;
        private String employeeId;
    }
}
