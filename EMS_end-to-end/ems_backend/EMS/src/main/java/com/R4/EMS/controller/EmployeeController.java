package com.R4.EMS.controller;

import com.R4.EMS.delegate.R4ApiDelegateImpl;
import com.R4.generated.dto.EmployeeDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/employees")
@Validated
public class EmployeeController {

    @Autowired
    private R4ApiDelegateImpl r4ApiDelegate;

    @Operation(summary = "Retrieve all employees", description = "Returns a list of employees")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "A list of employees", content = @Content(mediaType = "application/json", schema = @Schema(implementation = EmployeeDto.class)))
    })
    @GetMapping
    public ResponseEntity<List<EmployeeDto>> getAllEmployees() {
        return r4ApiDelegate.getEmployees();
    }

    @Operation(summary = "Retrieve an employee by ID", description = "Returns a single employee")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Employee details", content = @Content(mediaType = "application/json", schema = @Schema(implementation = EmployeeDto.class))),
        @ApiResponse(responseCode = "404", description = "Employee not found")
    })
    @GetMapping("/{id}")
    public ResponseEntity<EmployeeDto> getEmployeeById(
        @Parameter(description = "ID of the employee to return", required = true, schema = @Schema(type = "string", format = "uuid")) 
        @PathVariable UUID id) {
        return r4ApiDelegate.getEmployeeById(id);
    }

    @Operation(summary = "Create a new employee", description = "Adds a new employee to the system")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Employee created successfully", content = @Content(mediaType = "application/json", schema = @Schema(implementation = EmployeeDto.class)))
    })
    @PostMapping
    public ResponseEntity<EmployeeDto> createEmployee(
        @Parameter(description = "Employee object that needs to be added", required = true, schema = @Schema(implementation = EmployeeDto.class))
        @Valid @RequestBody EmployeeDto employeeDto) {
            return r4ApiDelegate.createEmployee(employeeDto);
        }

    @Operation(summary = "Update an employee by ID", description = "Updates an existing employee")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Employee updated successfully", content = @Content(mediaType = "application/json", schema = @Schema(implementation = EmployeeDto.class))),
        @ApiResponse(responseCode = "404", description = "Employee not found")
    })
    @PutMapping("/{id}")
    public ResponseEntity<EmployeeDto> updateEmployee(
        @Parameter(description = "ID of the employee to update", required = true, schema = @Schema(type = "string", format = "uuid")) 
        @PathVariable UUID id, 
        @Valid @RequestBody EmployeeDto employeeDto) {
        return r4ApiDelegate.updateEmployee(id, employeeDto);
    }

    @Operation(summary = "Delete an employee by ID", description = "Deletes an employee from the system")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Employee deleted successfully"),
        @ApiResponse(responseCode = "404", description = "Employee not found")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEmployee(
        @Parameter(description = "ID of the employee to delete", required = true, schema = @Schema(type = "string", format = "uuid")) 
        @PathVariable UUID id) {
        return r4ApiDelegate.deleteEmployee(id);
    }
}
