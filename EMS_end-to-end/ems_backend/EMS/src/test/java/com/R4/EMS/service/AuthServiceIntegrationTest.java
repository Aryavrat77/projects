/*  Can be testing locally but not for deployment.
package com.R4.EMS.service;
import com.R4.EMS.repository.UserRepository;
import com.R4.EMS.security.SecurityUser;
import com.R4.generated.dto.SignUpDto;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class AuthServiceIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @BeforeEach
    void setUp() {
        // Clear the repository to avoid constraint violations
        userRepository.deleteAll();
    }

    @Test
    void testLogin() throws Exception {
        // Setup test user data
        UUID userId = UUID.randomUUID();
        String password = passwordEncoder.encode("password");
        SecurityUser user = new SecurityUser();
        user.setId(userId);
        user.setFirstName("Rishab");
        user.setLastName("Nuguru");
        user.setEmail("rishab@gmail.com");
        user.setPassword(password);
        user.setRole(com.R4.EMS.security.role.Roles.HR);
        user.setEnabled(true);

        userRepository.save(user);

        // Perform login request
        mockMvc.perform(MockMvcRequestBuilders.post("/auth/login")
                        .contentType("application/json")
                        .content("{\"usernameOrEmail\": \"rishab@gmail.com\", \"password\": \"password\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.jwtToken").isNotEmpty())
                .andExpect(jsonPath("$.employeeId").value(user.getId().toString()));
    }

    @Test
    void testSignup() throws Exception {
        // Prepare the sign-up DTO
        SignUpDto signUpDto = new SignUpDto();
        signUpDto.setFirstName("Rishab");
        signUpDto.setLastName("Nuguru");
        signUpDto.setEmail("rishab@gmail.com");
        signUpDto.setPassword("password123");
        signUpDto.setRole(com.R4.generated.dto.Roles.EMPLOYEE);

        // Perform sign-up request
        mockMvc.perform(MockMvcRequestBuilders.post("/auth/signup")
                        .contentType("application/json")
                        .content("{\"firstName\": \"Rishab\", \"lastName\": \"Nuguru\", \"email\": \"rishab@gmail.com\", \"password\": \"password123\", \"role\": \"EMPLOYEE\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").isNotEmpty())
                .andExpect(jsonPath("$.firstName").value("Rishab"))
                .andExpect(jsonPath("$.lastName").value("Nuguru"))
                .andExpect(jsonPath("$.email").value("rishab@gmail.com"))
                .andExpect(jsonPath("$.role").value("EMPLOYEE"));

        // Verify the user is saved in the repository
        SecurityUser savedUser = userRepository.findByEmail("rishab@gmail.com").orElse(null);
        assertNotNull(savedUser);
        assertEquals("Rishab", savedUser.getFirstName());
        assertEquals("Nuguru", savedUser.getLastName());
        assertEquals("rishab@gmail.com", savedUser.getEmail());
        assertTrue(passwordEncoder.matches("password123", savedUser.getPassword()));
        assertEquals(com.R4.EMS.security.role.Roles.EMPLOYEE, savedUser.getRole());
    }
}

*/