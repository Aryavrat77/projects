package com.R4.EMS.service;

import com.R4.EMS.entity.Employee;
import com.R4.EMS.exception.InvalidCredentialsException;
import com.R4.EMS.repository.UserRepository;
import com.R4.EMS.security.JwtIssuer;
import com.R4.EMS.security.SecurityUser;
import com.R4.EMS.security.role.Roles;
import com.R4.generated.dto.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtIssuer jwtIssuer;

    @InjectMocks
    private AuthService authService;

    private LoginDto loginDto;
    private SignUpDto signUpDto;
    private SecurityUser user;
    private Employee employee;

    @BeforeEach
    void setUp() {
        loginDto = new LoginDto();
        loginDto.setUsernameOrEmail("rishab@gmail.com");
        loginDto.setPassword("password");

        signUpDto = new SignUpDto();
        signUpDto.setFirstName("Rishab");
        signUpDto.setLastName("Nuguru");
        signUpDto.setEmail("rishab@gmail.com");
        signUpDto.setPassword("password");
        signUpDto.setRole(com.R4.generated.dto.Roles.HR);

        UUID userId = UUID.randomUUID();
        user = new SecurityUser();
        user.setId(userId);
        user.setFirstName("Rishab");
        user.setLastName("Nuguru");
        user.setEmail("rishab@gmail.com");
        user.setPassword("encodedPassword");
        user.setRole(Roles.HR);
        user.setEnabled(true); // Default to enabled

        employee = new Employee();
        employee.setId(userId);
        employee.setFirstName("Rishab");
        employee.setLastName("Nuguru");
        employee.setEmail("rishab@gmail.com");
        employee.setRole(com.R4.generated.dto.Roles.HR);
        user.setEmployee(employee);
    }

    @Test
    void login_success() {
        try {
            // Arrange
            when(userRepository.findByEmail(loginDto.getUsernameOrEmail())).thenReturn(Optional.of(user));
            when(passwordEncoder.matches(loginDto.getPassword(), user.getPassword())).thenReturn(true);
            when(jwtIssuer.issue(user.getId(), user.getEmail(), user.getRole().name())).thenReturn("jwtToken");

            // Act
            AuthService.AuthResponse response = authService.login(loginDto);

            // Assert
            assertNotNull(response, "The response should not be null");
            assertEquals("jwtToken", response.getJwtToken(), "The JWT token should match the expected value");
            assertEquals(user.getId().toString(), response.getEmployeeId(), "The employee ID should match the expected value");
            verify(userRepository, times(1)).findByEmail(loginDto.getUsernameOrEmail());
            verify(passwordEncoder, times(1)).matches(loginDto.getPassword(), user.getPassword());
            verify(jwtIssuer, times(1)).issue(user.getId(), user.getEmail(), user.getRole().name());

        } catch (Exception e) {
            // If any unexpected exception is thrown, the test should fail with the provided message
            fail("An unexpected exception was thrown during login_success test: " + e.getMessage());
        }
    }

    @Test
    void login_failure_invalidCredentials() {
        // Arrange
        when(userRepository.findByEmail(loginDto.getUsernameOrEmail())).thenReturn(Optional.of(user));
        when(passwordEncoder.matches(loginDto.getPassword(), user.getPassword())).thenReturn(false);
    
        // Act & Assert
        InvalidCredentialsException exception = assertThrows(InvalidCredentialsException.class, () -> {
            authService.login(loginDto);
        });
    
        assertEquals("Username or password don't match up", exception.getMessage());
        verify(userRepository, times(1)).findByEmail(loginDto.getUsernameOrEmail());
        verify(passwordEncoder, times(1)).matches(loginDto.getPassword(), user.getPassword());
        verify(jwtIssuer, times(0)).issue(any(UUID.class), anyString(), anyString());
    }
    

    @Test
    void login_failure_userNotFound() {
        // Arrange
        when(userRepository.findByEmail(loginDto.getUsernameOrEmail())).thenReturn(Optional.empty());

        // Act & Assert
        InvalidCredentialsException exception = assertThrows(InvalidCredentialsException.class, () -> {
            authService.login(loginDto);
        });

        assertEquals("Username or password don't match up", exception.getMessage());
        verify(userRepository, times(1)).findByEmail(loginDto.getUsernameOrEmail());
        verify(passwordEncoder, times(0)).matches(anyString(), anyString());
        verify(jwtIssuer, times(0)).issue(any(UUID.class), anyString(), anyString());
    }


    @Test
    void signup_success() {
        // Arrange
        when(userRepository.findByEmail(signUpDto.getEmail())).thenReturn(Optional.empty());
        when(userRepository.save(any(SecurityUser.class))).thenAnswer(invocation -> {
            SecurityUser savedUser = invocation.getArgument(0);
            savedUser.setId(user.getId()); // Ensure the ID matches the expected user ID
            return savedUser;
        });
        when(passwordEncoder.encode(signUpDto.getPassword())).thenReturn("encodedPassword");

        // Act
        UserDto result = authService.signup(signUpDto);

        // Assert
        assertNotNull(result);
        assertEquals(user.getId(), result.getId());
        assertEquals(user.getEmail(), result.getEmail());
        assertEquals(user.getFirstName(), result.getFirstName());
        assertEquals(user.getLastName(), result.getLastName());
        assertEquals(com.R4.generated.dto.Roles.HR, result.getRole());

        verify(userRepository, times(1)).findByEmail(signUpDto.getEmail());
        verify(passwordEncoder, times(1)).encode(signUpDto.getPassword());
        verify(userRepository, times(1)).save(any(SecurityUser.class));
    }

    @Test
    void signup_failure_emailAlreadyInUse() {
        // Arrange
        when(userRepository.findByEmail(signUpDto.getEmail())).thenReturn(Optional.of(user));

        // Act & Assert
        IllegalStateException exception = assertThrows(IllegalStateException.class, () -> {
            authService.signup(signUpDto);
        });

        assertEquals("Email already in use", exception.getMessage());
        verify(userRepository, times(1)).findByEmail(signUpDto.getEmail());
        verify(passwordEncoder, times(0)).encode(anyString());
        verify(userRepository, times(0)).save(any(SecurityUser.class));
    }


    @Test
    void login_failure_userDisabled() {
        // Arrange
        user.setEnabled(false);
        when(userRepository.findByEmail(loginDto.getUsernameOrEmail())).thenReturn(Optional.of(user));

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            authService.login(loginDto);
        });

        assertEquals("User account is disabled", exception.getMessage());
        verify(userRepository, times(1)).findByEmail(loginDto.getUsernameOrEmail());
        verify(passwordEncoder, times(0)).matches(anyString(), anyString());
        verify(jwtIssuer, times(0)).issue(any(UUID.class), anyString(), anyString());
    }


    @Test
    void signup_failure_passwordTooWeak() {
        // Arrange
        signUpDto.setPassword("123"); // Weak password

        // Act & Assert
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            authService.signup(signUpDto);
        });

        assertEquals("Password is too weak", exception.getMessage());
        verify(userRepository, times(0)).findByEmail(anyString());
        verify(passwordEncoder, times(0)).encode(anyString());
        verify(userRepository, times(0)).save(any(SecurityUser.class));
    }
}
