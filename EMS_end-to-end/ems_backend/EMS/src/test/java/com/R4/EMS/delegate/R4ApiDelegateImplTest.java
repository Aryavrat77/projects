package com.R4.EMS.delegate;

import com.R4.generated.controller.R4ApiDelegate;
import com.R4.EMS.delegate.R4ApiDelegateImpl;
import com.R4.generated.dto.EmployeeDto;
import com.R4.EMS.service.EmployeeService;
import com.R4.EMS.service.EmployeeService;
import com.R4.generated.dto.EmployeeDto;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import java.time.LocalDate;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class R4ApiDelegateImplTest {

    @Mock
    private EmployeeService employeeService;

    @InjectMocks
    private R4ApiDelegateImpl r4ApiDelegateImpl;

    private EmployeeDto employeeDto;

    @BeforeEach
    void setUp() {
        // Setup EmployeeDto
        employeeDto = new EmployeeDto();
        employeeDto.setFirstName("Rishab");
        employeeDto.setLastName("Nuguru");
        employeeDto.setEmail("rishab.nuguru@gmail.com");
        employeeDto.setJobTitle("Software Developer");
        employeeDto.setEmploymentType(EmployeeDto.EmploymentTypeEnum.FULL_TIME);
        employeeDto.setAvailableStartDate(LocalDate.of(2024, 4, 16));
    }

    @Test
    void testCreateEmployee() {
        // Since createEmployee doesn't return a value, we don't need to stub it. Instead, we just verify it is called.
        // when(employeeService.createEmployee(employeeDto)).thenReturn(null);

        ResponseEntity<EmployeeDto> response = r4ApiDelegateImpl.createEmployee(employeeDto);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        verify(employeeService, times(1)).createEmployee(employeeDto);
    }


    @Test
    void testCreateEmployeeWithException() {
        doThrow(new RuntimeException()).when(employeeService).createEmployee(any(EmployeeDto.class));

        ResponseEntity<EmployeeDto> response = r4ApiDelegateImpl.createEmployee(employeeDto);

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        verify(employeeService, times(1)).createEmployee(employeeDto);
    }
}
