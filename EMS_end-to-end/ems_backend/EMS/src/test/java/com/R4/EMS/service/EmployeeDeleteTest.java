package com.R4.EMS.service;

import com.R4.EMS.delegate.R4ApiDelegateImpl;
import com.R4.generated.dto.EducationDto;
import com.R4.generated.dto.WorkHistoryDto;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Collections;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class EmployeeDeleteTest {

    @Mock
    private EmployeeService employeeService;

    @Mock
    private EducationService educationService;

    @Mock
    private WorkHistoryService workHistoryService;

    @InjectMocks
    private R4ApiDelegateImpl r4ApiDelegate;

    private UUID employeeId;

    @BeforeEach
    public void setUp() {
        employeeId = UUID.randomUUID();
    }

    @Test
    public void testDeleteEmployee_Success() {
        try {
            // Arrange
            when(educationService.getEmployeeEducation(employeeId)).thenReturn(Collections.emptyList());
            when(workHistoryService.getEmployeeWorkHistory(employeeId)).thenReturn(Collections.emptyList());
            when(employeeService.deleteEmployee(employeeId)).thenReturn(true);

            // Act
            ResponseEntity<Void> response = r4ApiDelegate.deleteEmployee(employeeId);

            // Assert
            assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
            verify(educationService, times(1)).getEmployeeEducation(employeeId);
            verify(workHistoryService, times(1)).getEmployeeWorkHistory(employeeId);
            verify(employeeService, times(1)).deleteEmployee(employeeId);
            verifyNoMoreInteractions(educationService, workHistoryService, employeeService);
        } catch (Exception e) {
            // Handle unexpected exceptions
            e.printStackTrace();
        }
    }

    @Test
    public void testDeleteEmployee_NotFound() {
        try {
            // Arrange
            when(educationService.getEmployeeEducation(employeeId)).thenReturn(Collections.emptyList());
            when(workHistoryService.getEmployeeWorkHistory(employeeId)).thenReturn(Collections.emptyList());
            when(employeeService.deleteEmployee(employeeId)).thenReturn(false);

            // Act
            ResponseEntity<Void> response = r4ApiDelegate.deleteEmployee(employeeId);

            // Assert
            assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
            verify(educationService, times(1)).getEmployeeEducation(employeeId);
            verify(workHistoryService, times(1)).getEmployeeWorkHistory(employeeId);
            verify(employeeService, times(1)).deleteEmployee(employeeId);
            verifyNoMoreInteractions(educationService, workHistoryService, employeeService);
        } catch (Exception e) {
            // Handle unexpected exceptions
            e.printStackTrace();
        }
    }

    @Test
    public void testDeleteEmployee_Exception() {
        try {
            // Arrange
            when(educationService.getEmployeeEducation(employeeId)).thenThrow(new RuntimeException("Service exception"));

            // Act
            ResponseEntity<Void> response = r4ApiDelegate.deleteEmployee(employeeId);

            // Assert
            assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
            verify(educationService, times(1)).getEmployeeEducation(employeeId);
            verify(workHistoryService, times(0)).getEmployeeWorkHistory(employeeId);
            verify(employeeService, times(0)).deleteEmployee(employeeId);
            verifyNoMoreInteractions(educationService, workHistoryService, employeeService);
        } catch (Exception e) {
            // Handle unexpected exceptions
            e.printStackTrace();
        }
    }
}
