package com.R4.EMS.service;

import com.R4.EMS.entity.Employee;
import com.R4.EMS.repository.EmployeeRepository;
import com.R4.generated.dto.EmployeeDto;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.server.ResponseStatusException;
import com.R4.EMS.repository.SecurityUserRepository;

import javax.validation.Valid;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Validated
public class EmployeeService {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private SecurityUserRepository securityUserRepository;



    public EmployeeDto createEmployee(@Valid EmployeeDto dto) {
        Employee employee = modelMapper.map(dto, Employee.class);
        try {
            Employee savedEmployee = employeeRepository.save(employee);
            return modelMapper.map(savedEmployee, EmployeeDto.class);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Failed to create employee: " + e.getMessage(), e);
        }
    }

    public List<EmployeeDto> getEmployees() {
        try {
            return employeeRepository.findAll().stream()
                    .map(emp -> modelMapper.map(emp, EmployeeDto.class))
                    .collect(Collectors.toList());
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to retrieve employees", e);
        }
    }

    public Optional<EmployeeDto> getEmployeeById(UUID id) {
        return employeeRepository.findById(id)
                .map(emp -> modelMapper.map(emp, EmployeeDto.class));
    }

    public Optional<EmployeeDto> updateEmployee(UUID id, @Valid EmployeeDto employeeDto) {
        return employeeRepository.findById(id).map(existingEmployee -> {
            modelMapper.map(employeeDto, existingEmployee);
            Employee updatedEmployee = employeeRepository.save(existingEmployee);
            return modelMapper.map(updatedEmployee, EmployeeDto.class);
        });
    }

    public boolean deleteEmployee(UUID id) {
        Optional<Employee> employeeOpt = employeeRepository.findById(id);
        if (employeeOpt.isPresent()) {
            Employee employee = employeeOpt.get();

            // Explicitly delete the associated SecurityUser first
            securityUserRepository.findByEmployee(employee).ifPresent(securityUserRepository::delete);

            // Delete the employee
            employeeRepository.delete(employee);
            return true;
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Employee not found");
        }
    }


    public EmployeeDto findByEmail(String email) {
        return employeeRepository.findByEmail(email)
                .map(emp -> modelMapper.map(emp, EmployeeDto.class))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Employee not found with email: " + email));
    }
    
    
}
