package com.R4.EMS.delegate;

import com.R4.EMS.exception.InvalidCredentialsException;
import com.R4.EMS.exception.UserDisabledException;
import com.R4.EMS.service.AuthService;
import com.R4.EMS.service.EducationService;
import com.R4.EMS.service.EmployeeService;
import com.R4.EMS.service.WorkHistoryService;
import com.R4.generated.controller.R4ApiDelegate;
import com.R4.generated.dto.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.UUID;

@Component
public class R4ApiDelegateImpl implements R4ApiDelegate {

    private static final Logger log = LoggerFactory.getLogger(R4ApiDelegateImpl.class);

    @Autowired
    private EmployeeService employeeService;

    @Autowired
    private EducationService educationService;

    @Autowired
    private WorkHistoryService workHistoryService;

    @Autowired
    private AuthService authService;

public ResponseEntity<AuthService.AuthResponse> login(LoginDto body) {
    try {
        AuthService.AuthResponse authResponse = authService.login(body);
        return ResponseEntity.status(HttpStatus.OK).body(authResponse);
    } catch (InvalidCredentialsException e) {
        log.error("Login failed: Invalid credentials", e);
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new AuthService.AuthResponse(e.getMessage(), null));
    } catch (UserDisabledException e) {
        log.error("Login failed: User account is disabled", e);
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(new AuthService.AuthResponse(e.getMessage(), null));
    } catch (Exception e) {
        log.error("Login failed", e);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new AuthService.AuthResponse("Login failed", null));
    }
}


public ResponseEntity<UserDto> signup(SignUpDto body) {
    try {
        UserDto user = authService.signup(body);
        return ResponseEntity.status(HttpStatus.OK).body(user);
    } catch (IllegalArgumentException e) {
        log.error("Signup failed: Invalid input", e);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
    } catch (IllegalStateException e) {
        log.error("Signup failed: Email already in use", e);
        return ResponseEntity.status(HttpStatus.CONFLICT).body(null);
    } catch (Exception e) {
        log.error("Signup failed", e);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
    }
}

    @Override
    public ResponseEntity<EmployeeDto> createEmployee(EmployeeDto body) {
        try {
            EmployeeDto createdEmployee = employeeService.createEmployee(body);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdEmployee);
        } catch (ResponseStatusException e) {
            return ResponseEntity.status(e.getStatusCode()).body(null);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @Override
    public ResponseEntity<EmployeeDto> getEmployeeById(UUID id) {
        try {
            Optional<EmployeeDto> employee = employeeService.getEmployeeById(id);
            return employee.map(ResponseEntity::ok)
                    .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body(null));
        } catch (ResponseStatusException e) {
            return ResponseEntity.status(e.getStatusCode()).body(null);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @Override
    public ResponseEntity<List<EmployeeDto>> getEmployees() {
        try {
            List<EmployeeDto> employees = employeeService.getEmployees();
            return ResponseEntity.ok(employees);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @Override
    public ResponseEntity<EmployeeDto> updateEmployee(UUID id, EmployeeDto body) {
        try {
            EmployeeDto updatedEmployee = employeeService.updateEmployee(id, body).orElseThrow(() ->
                    new NoSuchElementException("Employee not found with id: " +id));
            return ResponseEntity.status(HttpStatus.CREATED).body(updatedEmployee);
        } catch (ResponseStatusException e) {
            return ResponseEntity.status(e.getStatusCode()).body(null);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @Override
    public ResponseEntity<Void> deleteEmployee(UUID id) {
        try {
            List<EducationDto> educationDtoList = educationService.getEmployeeEducation(id);
            educationDtoList.forEach(educationDto -> deleteEmployeeEducation(educationDto.getEducationId()));
            List<WorkHistoryDto> workHistoryDtoList = workHistoryService.getEmployeeWorkHistory(id);
            workHistoryDtoList.forEach(workHistoryDto -> deleteEmployeeWorkHistory(workHistoryDto.getWorkHistoryId()));
            boolean isDeleted = employeeService.deleteEmployee(id);
            return isDeleted ? ResponseEntity.noContent().build() : ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        } catch (ResponseStatusException e) {
            return ResponseEntity.status(e.getStatusCode()).body(null);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @Override
    public ResponseEntity<EducationDto> addEmployeeEducation(UUID id, EducationDto body) {
        try {
            EducationDto educationDto = educationService.addEmployeeEducation(id, body);
            return ResponseEntity.status(HttpStatus.CREATED).body(educationDto);
        } catch (Exception e) {
            log.error("Error adding employee education", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @Override
    public ResponseEntity<WorkHistoryDto> addEmployeeWorkHistory(UUID id, WorkHistoryDto body) {
        try {
            WorkHistoryDto workHistoryDto = workHistoryService.addEmployeeWorkHistory(id, body);
            return ResponseEntity.status(HttpStatus.CREATED).body(workHistoryDto);
        } catch (Exception e) {
            log.error("Error adding employee work history", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @Override
    public ResponseEntity<Void> deleteEmployeeEducation(UUID id) {
        try {
            educationService.deleteEmployeeEducation(id);
            return ResponseEntity.status(HttpStatus.ACCEPTED).build();
        } catch (Exception e) {
            log.error("Error deleting employee education", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @Override
    public ResponseEntity<Void> deleteEmployeeWorkHistory(UUID id) {
        try {
            workHistoryService.deleteEmployeeWorkHistory(id);
            return ResponseEntity.status(HttpStatus.ACCEPTED).build();
        } catch (Exception e) {
            log.error("Error deleting employee work history", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @Override
    public ResponseEntity<List<EducationDto>> getEmployeeEducation(UUID id) {
        try {
            List<EducationDto> list = educationService.getEmployeeEducation(id);
            return new ResponseEntity<>(list, HttpStatus.OK);
        } catch (Exception e) {
            log.error("Error fetching employee education", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @Override
    public ResponseEntity<List<WorkHistoryDto>> getEmployeeWorkHistory(UUID id) {
        try {
            List<WorkHistoryDto> list = workHistoryService.getEmployeeWorkHistory(id);
            return new ResponseEntity<>(list, HttpStatus.OK);
        } catch (Exception e) {
            log.error("Error fetching employee work history", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @Override
    public ResponseEntity<Void> updateEmployeeEducation(UUID id, EducationDto body) {
        try {
            educationService.updateEducation(id, body);
            return ResponseEntity.status(HttpStatus.OK).build();
        } catch (Exception e) {
            log.error("Error updating employee education history", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @Override
    public ResponseEntity<Void> updateEmployeeWorkHistory(UUID id, WorkHistoryDto body) {
        try {
            workHistoryService.updateWorkHistory(id, body);
            return ResponseEntity.status(HttpStatus.OK).build();
        } catch (Exception e) {
            log.error("Error updating employee work history", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
