package com.R4.EMS.service;

import com.R4.EMS.entity.Employee;
import com.R4.EMS.repository.EmployeeRepository;
import com.R4.EMS.repository.SecurityUserRepository;
import com.R4.generated.dto.EmployeeDto;
import com.R4.EMS.security.SecurityUser;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EmployeeServiceTest {

    @Mock
    private EmployeeRepository employeeRepository;

    @Mock
    private ModelMapper modelMapper;

    @Mock
    private SecurityUserRepository securityUserRepository;

    @InjectMocks
    private EmployeeService employeeService;

    private Employee employee;
    private EmployeeDto employeeDto;
    private UUID employeeId;

    @BeforeEach
    void setUp() {
        employeeId = UUID.randomUUID();
        employee = new Employee();
        employee.setId(employeeId);
        employee.setEmail("rnuguruworkspace@gmail.com");

        employeeDto = new EmployeeDto();
        employeeDto.setId(employeeId);
        employeeDto.setEmail("rnuguruworkspace@gmail.com");
    }

    @Test
    void createEmployee_success() {
        try {
            // Arrange
            // Mocking the mapping from EmployeeDto to Employee
            when(modelMapper.map(employeeDto, Employee.class)).thenReturn(employee);
            // Mocking the save operation of employeeRepository
            when(employeeRepository.save(employee)).thenReturn(employee);
            // Mocking the mapping from Employee back to EmployeeDto
            when(modelMapper.map(employee, EmployeeDto.class)).thenReturn(employeeDto);
    
            // Act
            // Calling the createEmployee method with the mocked data
            EmployeeDto result = employeeService.createEmployee(employeeDto);
    
            // Assert
            // Verifying that the result is not null
            assertNotNull(result, "The created employee result should not be null");
            // Verifying that the ID of the created employee matches the expected ID
            assertEquals(employeeDto.getId(), result.getId(), "The employee ID should match the expected ID");
            // Verifying that the email of the created employee matches the expected email
            assertEquals(employeeDto.getEmail(), result.getEmail(), "The employee email should match the expected email");
            // Verifying that the save method of employeeRepository was called exactly once
            verify(employeeRepository, times(1)).save(employee);
    
        } catch (ResponseStatusException e) {
            // If a ResponseStatusException is thrown, the test should fail with the provided message
            fail("Should not throw a ResponseStatusException: " + e.getMessage());
        } catch (Exception e) {
            // If any other exception is thrown, the test should fail with the provided message
            fail("An unexpected exception was thrown: " + e.getMessage());
        }
    }
    

    @Test
    void createEmployee_failure() {
        try {
            // Arrange
            // Mocking the mapping from EmployeeDto to Employee
            when(modelMapper.map(employeeDto, Employee.class)).thenReturn(employee);
            // Mocking the save operation of employeeRepository to throw an exception
            when(employeeRepository.save(employee)).thenThrow(new RuntimeException("Failed to save"));
    
            // Act & Assert
            // Expecting a ResponseStatusException when the createEmployee method is called
            ResponseStatusException exception = assertThrows(ResponseStatusException.class, () -> {
                employeeService.createEmployee(employeeDto);
            }, "Expected ResponseStatusException due to save failure");
    
            // Assert
            // Verifying that the status code of the exception is BAD_REQUEST
            assertEquals(HttpStatus.BAD_REQUEST, exception.getStatusCode(), "The status code should be BAD_REQUEST");
            // Verifying that the save method of employeeRepository was called exactly once
            verify(employeeRepository, times(1)).save(employee);
            // Verifying that no other interactions have happened with the employeeRepository
            verifyNoMoreInteractions(employeeRepository);
            // Verifying that no interactions have happened with the securityUserRepository
            verifyNoInteractions(securityUserRepository);
    
        } catch (Exception e) {
            // If any unexpected exception is thrown, the test should fail with the provided message
            fail("An unexpected exception was thrown: " + e.getMessage());
        }
    }
    

    @Test
    void getEmployees_success() {
        try {
            // Arrange
            // Mocking the repository's findAll method to return a list containing the employee
            List<Employee> employees = Collections.singletonList(employee);
            when(employeeRepository.findAll()).thenReturn(employees);
            // Mocking the model mapper to map the employee to employeeDto
            when(modelMapper.map(employee, EmployeeDto.class)).thenReturn(employeeDto);

            // Act
            // Calling the getEmployees method to retrieve the list of employee DTOs
            List<EmployeeDto> result = employeeService.getEmployees();

            // Assert
            // Asserting that the result list is not null
            assertNotNull(result, "The result list should not be null");
            // Asserting that the result list contains exactly one element
            assertEquals(1, result.size(), "The result list should contain exactly one element");
            // Asserting that the element in the result list matches the expected employeeDto
            assertEquals(employeeDto, result.get(0), "The employee DTO in the result list should match the expected employee DTO");
            // Verifying that the findAll method of employeeRepository was called exactly once
            verify(employeeRepository, times(1)).findAll();
            // Verifying that the modelMapper was used to map the Employee to EmployeeDto for each employee
            verify(modelMapper, times(1)).map(employee, EmployeeDto.class);
            // Ensuring no other interactions with the mocks
            verifyNoMoreInteractions(employeeRepository);
            verifyNoMoreInteractions(modelMapper);
        } catch (Exception e) {
            // If any unexpected exception is thrown, the test should fail with the provided message
            fail("An unexpected exception was thrown: " + e.getMessage());
        }
    }


    @Test
    void getEmployees_failure() {
        try {
            // Arrange
            // Mocking the repository's findAll method to throw a RuntimeException
            when(employeeRepository.findAll()).thenThrow(new RuntimeException("Failed to retrieve"));
    
            // Act & Assert
            // Expecting a ResponseStatusException when the getEmployees method is called
            ResponseStatusException exception = assertThrows(ResponseStatusException.class, () -> {
                employeeService.getEmployees();
            }, "Expected ResponseStatusException due to repository retrieval failure");
    
            // Assert
            // Asserting that the status code of the exception is INTERNAL_SERVER_ERROR
            assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, exception.getStatusCode(), "The status code should be INTERNAL_SERVER_ERROR");
            // Verifying that the findAll method of employeeRepository was called exactly once
            verify(employeeRepository, times(1)).findAll();
            // Verifying that no other interactions have happened with the employeeRepository
            verifyNoMoreInteractions(employeeRepository);
        } catch (Exception e) {
            // If any unexpected exception is thrown, the test should fail with the provided message
            fail("An unexpected exception was thrown during getEmployees_failure test: " + e.getMessage());
        }
    }
    

    @Test
    void getEmployeeById_success() {
        try {
            // Arrange
            // Mocking the repository's findById method to return an Optional containing the employee
            when(employeeRepository.findById(employeeId)).thenReturn(Optional.of(employee));
            // Mocking the model mapper to map the employee to employeeDto
            when(modelMapper.map(employee, EmployeeDto.class)).thenReturn(employeeDto);
    
            // Act
            // Calling the getEmployeeById method to retrieve the employee DTO by ID
            Optional<EmployeeDto> result = employeeService.getEmployeeById(employeeId);
    
            // Assert
            // Verifying that the result is present
            assertTrue(result.isPresent(), "The result should be present");
            // Verifying that the ID of the result matches the expected ID
            assertEquals(employeeDto.getId(), result.get().getId(), "The employee ID should match the expected ID");
            // Verifying that the email of the result matches the expected email
            assertEquals(employeeDto.getEmail(), result.get().getEmail(), "The employee email should match the expected email");
            // Verifying that the findById method of employeeRepository was called exactly once
            verify(employeeRepository, times(1)).findById(employeeId);
            // Verifying that the modelMapper was used to map the Employee to EmployeeDto
            verify(modelMapper, times(1)).map(employee, EmployeeDto.class);
            // Ensuring no other interactions with the mocks
            verifyNoMoreInteractions(employeeRepository);
            verifyNoMoreInteractions(modelMapper);
        } catch (Exception e) {
            // If any unexpected exception is thrown, the test should fail with the provided message
            fail("An unexpected exception was thrown during getEmployeeById_success test: " + e.getMessage());
        }
    }
    

    @Test
    void getEmployeeById_notFound() {
        try {
            // Arrange
            // Mocking the repository's findById method to return an empty Optional
            when(employeeRepository.findById(employeeId)).thenReturn(Optional.empty());
    
            // Act
            // Calling the getEmployeeById method to retrieve the employee DTO by ID
            Optional<EmployeeDto> result = employeeService.getEmployeeById(employeeId);
    
            // Assert
            // Verifying that the result is not present
            assertFalse(result.isPresent(), "The result should not be present as the employee was not found");
            // Verifying that the findById method of employeeRepository was called exactly once
            verify(employeeRepository, times(1)).findById(employeeId);
            // Ensuring no other interactions with the employeeRepository
            verifyNoMoreInteractions(employeeRepository);
        } catch (ResponseStatusException e) {
            // If a ResponseStatusException is thrown, the test should fail with the provided message
            fail("Should not throw a ResponseStatusException: " + e.getMessage());
        } catch (Exception e) {
            // If any other unexpected exception is thrown, the test should fail with the provided message
            fail("An unexpected exception was thrown during getEmployeeById_notFound test: " + e.getMessage());
        }
    }
    

    @Test
    void updateEmployee_success() {
        try {
            // Arrange
            // Mocking the repository's findById method to return an Optional containing the employee
            when(employeeRepository.findById(employeeId)).thenReturn(Optional.of(employee));
            // Mocking the repository's save method to return the employee
            when(employeeRepository.save(any(Employee.class))).thenReturn(employee);
            // Mocking the model mapper to do nothing when mapping employeeDto to employee
            doNothing().when(modelMapper).map(employeeDto, employee);
            // Mocking the model mapper to map the updated employee back to EmployeeDto
            when(modelMapper.map(employee, EmployeeDto.class)).thenReturn(employeeDto);
    
            // Act
            // Calling the updateEmployee method to update the employee
            Optional<EmployeeDto> result = employeeService.updateEmployee(employeeId, employeeDto);
    
            // Assert
            // Verifying that the result is present
            assertTrue(result.isPresent(), "The result should be present after updating the employee");
            // Verifying that the ID of the result matches the expected ID
            assertEquals(employeeDto.getId(), result.get().getId(), "The employee ID should match the expected ID");
            // Verifying that the email of the result matches the expected email
            assertEquals(employeeDto.getEmail(), result.get().getEmail(), "The employee email should match the expected email");
            // Verifying that the findById method of employeeRepository was called exactly once
            verify(employeeRepository, times(1)).findById(employeeId);
            // Verifying that the save method of employeeRepository was called exactly once
            verify(employeeRepository, times(1)).save(employee);
            // Verifying that the modelMapper was used to map employeeDto to employee
            verify(modelMapper, times(1)).map(employeeDto, employee);
            // Verifying that the modelMapper was used to map employee to employeeDto
            verify(modelMapper, times(1)).map(employee, EmployeeDto.class);
            // Ensuring no other interactions with the mocks
            verifyNoMoreInteractions(employeeRepository);
            verifyNoMoreInteractions(modelMapper);
    
        } catch (ResponseStatusException e) {
            // If a ResponseStatusException is thrown, the test should fail with the provided message
            fail("Should not throw a ResponseStatusException: " + e.getMessage());
        } catch (Exception e) {
            // If any other unexpected exception is thrown, the test should fail with the provided message
            fail("An unexpected exception was thrown during updateEmployee_success test: " + e.getMessage());
        }
    }
    
    @Test
    void updateEmployee_notFound() {
        try {
            // Arrange
            // Mocking the repository's findById method to return an empty Optional
            when(employeeRepository.findById(employeeId)).thenReturn(Optional.empty());
    
            // Act
            // Calling the updateEmployee method to attempt updating the employee
            Optional<EmployeeDto> result = employeeService.updateEmployee(employeeId, employeeDto);
    
            // Assert
            // Verifying that the result is not present since the employee was not found
            assertFalse(result.isPresent(), "The result should not be present as the employee was not found");
            // Verifying that the findById method of employeeRepository was called exactly once
            verify(employeeRepository, times(1)).findById(employeeId);
            // Verifying that the save method of employeeRepository was never called
            verify(employeeRepository, times(0)).save(employee);
            // Ensuring no other interactions with the employeeRepository
            verifyNoMoreInteractions(employeeRepository);
        } catch (ResponseStatusException e) {
            // If a ResponseStatusException is thrown, the test should fail with the provided message
            fail("Should not throw a ResponseStatusException: " + e.getMessage());
        } catch (Exception e) {
            // If any other unexpected exception is thrown, the test should fail with the provided message
            fail("An unexpected exception was thrown during updateEmployee_notFound test: " + e.getMessage());
        }
    }
    

    @Test
    void deleteEmployee_success() {
        try {
            // Arrange
            // Mocking the repository's findById method to return an Optional containing the employee
            when(employeeRepository.findById(employeeId)).thenReturn(Optional.of(employee));
            // Mocking the securityUserRepository's findByEmployee method to return an empty Optional
            when(securityUserRepository.findByEmployee(employee)).thenReturn(Optional.empty());
    
            // Act
            // Calling the deleteEmployee method to delete the employee
            boolean result = employeeService.deleteEmployee(employeeId);
    
            // Assert
            // Verifying that the result is true, indicating successful deletion
            assertTrue(result, "The result should be true indicating the employee was successfully deleted");
            // Verifying that the findById method of employeeRepository was called exactly once with the correct ID
            verify(employeeRepository, times(1)).findById(employeeId);
            // Verifying that the delete method of employeeRepository was called exactly once with the correct employee
            verify(employeeRepository, times(1)).delete(employee);
            // Verifying that the findByEmployee method of securityUserRepository was called exactly once with the correct employee
            verify(securityUserRepository, times(1)).findByEmployee(employee);
            // Verifying that the delete method of securityUserRepository was not called since no associated security user exists
            verify(securityUserRepository, times(0)).delete(any());
            // Ensuring no other interactions with the mocks
            verifyNoMoreInteractions(employeeRepository);
            verifyNoMoreInteractions(securityUserRepository);
        } catch (ResponseStatusException e) {
            // If a ResponseStatusException is thrown, the test should fail with the provided message
            fail("Should not throw a ResponseStatusException: " + e.getMessage());
        } catch (Exception e) {
            // If any other unexpected exception is thrown, the test should fail with the provided message
            fail("An unexpected exception was thrown during deleteEmployee_success test: " + e.getMessage());
        }
    }
    

    @Test
    void deleteEmployee_notFound() {
        try {
            // Arrange
            // Mocking the repository's findById method to return an empty Optional
            when(employeeRepository.findById(employeeId)).thenReturn(Optional.empty());
    
            // Act & Assert
            // Expecting a ResponseStatusException when the deleteEmployee method is called
            ResponseStatusException exception = assertThrows(ResponseStatusException.class, () -> {
                employeeService.deleteEmployee(employeeId);
            }, "Expected ResponseStatusException due to employee not found");
    
            // Assert
            // Asserting that the status code of the exception is NOT_FOUND
            assertEquals(HttpStatus.NOT_FOUND, exception.getStatusCode(), "The status code should be NOT_FOUND");
            // Verifying that the findById method of employeeRepository was called exactly once
            verify(employeeRepository, times(1)).findById(employeeId);
            // Verifying that the delete method of employeeRepository was never called
            verify(employeeRepository, times(0)).delete(any(Employee.class));
            // Ensuring no other interactions with the mocks
            verifyNoMoreInteractions(employeeRepository);
            verifyNoInteractions(securityUserRepository);
    
        } catch (ResponseStatusException e) {
            // If a ResponseStatusException is thrown, the test should fail with the provided message
            fail("Unexpected ResponseStatusException: " + e.getMessage());
        } catch (Exception e) {
            // If any other unexpected exception is thrown, the test should fail with the provided message
            fail("An unexpected exception was thrown during deleteEmployee_notFound test: " + e.getMessage());
        }
    }
    

    @Test
    void deleteEmployee_withSecurityUser() {
        try {
            // Arrange
            // Mocking the repository's findById method to return an Optional containing the employee
            when(employeeRepository.findById(employeeId)).thenReturn(Optional.of(employee));
            // Mocking the securityUserRepository's findByEmployee method to return an Optional containing a SecurityUser
            SecurityUser securityUser = new SecurityUser();
            when(securityUserRepository.findByEmployee(employee)).thenReturn(Optional.of(securityUser));
    
            // Act
            // Calling the deleteEmployee method to delete the employee and associated security user
            boolean result = employeeService.deleteEmployee(employeeId);
    
            // Assert
            // Verifying that the result is true, indicating successful deletion
            assertTrue(result, "The result should be true indicating the employee and associated security user were successfully deleted");
            // Verifying that the findByEmployee method of securityUserRepository was called exactly once with the correct employee
            verify(securityUserRepository, times(1)).findByEmployee(employee);
            // Verifying that the delete method of securityUserRepository was called exactly once with the correct security user
            verify(securityUserRepository, times(1)).delete(securityUser);
            // Verifying that the delete method of employeeRepository was called exactly once with the correct employee
            verify(employeeRepository, times(1)).delete(employee);
            // Ensuring no other interactions with the mocks
            verifyNoMoreInteractions(employeeRepository);
            verifyNoMoreInteractions(securityUserRepository);
        } catch (ResponseStatusException e) {
            // If a ResponseStatusException is thrown, the test should fail with the provided message
            fail("Unexpected ResponseStatusException: " + e.getMessage());
        } catch (Exception e) {
            // If any other unexpected exception is thrown, the test should fail with the provided message
            fail("An unexpected exception was thrown during deleteEmployee_withSecurityUser test: " + e.getMessage());
        }
    }
    

    @Test
    void findByEmail_success() {
        try {
            // Arrange
            // Mocking the repository's findByEmail method to return an Optional containing the employee
            String email = "rnuguruworkspace@gmail.com";
            when(employeeRepository.findByEmail(email)).thenReturn(Optional.of(employee));
            // Mocking the model mapper to map the employee to employeeDto
            when(modelMapper.map(employee, EmployeeDto.class)).thenReturn(employeeDto);
    
            // Act
            // Calling the findByEmail method to retrieve the employee DTO by email
            EmployeeDto result = employeeService.findByEmail(email);
    
            // Assert
            // Verifying that the email of the result matches the expected email
            assertEquals(email, result.getEmail(), "The email of the result should match the expected email");
            // Verifying that the ID of the result matches the expected employee ID
            assertEquals(employee.getId(), result.getId(), "The employee ID should match the expected employee ID");
            // Verifying that the findByEmail method of employeeRepository was called exactly once
            verify(employeeRepository, times(1)).findByEmail(email);
            // Ensuring no other interactions with the employeeRepository and modelMapper
            verifyNoMoreInteractions(employeeRepository);
            verifyNoMoreInteractions(modelMapper);
        } catch (ResponseStatusException e) {
            // If a ResponseStatusException is thrown, the test should fail with the provided message
            fail("Unexpected ResponseStatusException: " + e.getMessage());
        } catch (Exception e) {
            // If any other unexpected exception is thrown, the test should fail with the provided message
            fail("An unexpected exception was thrown during findByEmail_success test: " + e.getMessage());
        }
    }
    
    @Test
    void findByEmail_failure() {
        try {
            // Arrange
            // Mocking the repository's findByEmail method to return an empty Optional
            String email = "rnuguruworkspace@gmail.com";
            when(employeeRepository.findByEmail(email)).thenReturn(Optional.empty());
    
            // Act & Assert
            // Expecting a ResponseStatusException when the findByEmail method is called
            ResponseStatusException exception = assertThrows(ResponseStatusException.class, () -> {
                employeeService.findByEmail(email);
            }, "Expected ResponseStatusException due to employee not found by email");
    
            // Assert
            // Asserting that the status code of the exception is NOT_FOUND
            assertEquals(HttpStatus.NOT_FOUND, exception.getStatusCode(), "The status code should be NOT_FOUND");
            // Verifying that the findByEmail method of employeeRepository was called exactly once
            verify(employeeRepository, times(1)).findByEmail(email);
            // Ensuring no other interactions with the employeeRepository
            verifyNoMoreInteractions(employeeRepository);
        } catch (ResponseStatusException e) {
            // If a ResponseStatusException is thrown, the test should fail with the provided message
            fail("Unexpected ResponseStatusException: " + e.getMessage());
        } catch (Exception e) {
            // If any other unexpected exception is thrown, the test should fail with the provided message
            fail("An unexpected exception was thrown during findByEmail_failure test: " + e.getMessage());
        }
    }
    

}
