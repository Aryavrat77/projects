package com.R4.EMS.controller;

import com.R4.EMS.delegate.R4ApiDelegateImpl;
import com.R4.generated.dto.EducationDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
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
public class EducationController {

    @Autowired
    R4ApiDelegateImpl r4ApiDelegate;

    @Operation(summary = "Add education history for an employee")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Education history added successfully")
    })
    @PostMapping("/{id}/education")
    public ResponseEntity<EducationDto> addEmployeeEducation(@PathVariable("id") UUID id, @Valid @RequestBody EducationDto body) {

        return r4ApiDelegate.addEmployeeEducation(id, body);
    }

    @Operation(summary = "Delete an employee's Education entry", description = "", tags={ "Employees" })
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Employee education entry deleted successfully") })
    @DeleteMapping("/{id}/education")
    public ResponseEntity<Void> deleteEmployeeEducation(@PathVariable("id") UUID id) {
        return r4ApiDelegate.deleteEmployeeEducation(id);
    }


    @Operation(summary = "Retrieve the education  of an employee by ID", description = "", tags={ "Employees" })
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Employee education details", content = @Content(mediaType = "application/json", array = @ArraySchema(schema = @Schema(implementation = EducationDto.class)))) })
    @GetMapping(value = "/{id}/education")
    public ResponseEntity<List<EducationDto>> getEmployeeEducation(@PathVariable("id") UUID id) {
        return r4ApiDelegate.getEmployeeEducation(id);
    }


    @Operation(summary = "Update an employee's education", description = "", tags={ "Employees" })
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Education updated successfully") })
    @PutMapping("/{id}/education")
    public ResponseEntity<Void> updateEmployeeEducation(@PathVariable("id") UUID id, @Valid @RequestBody EducationDto body) {
        return r4ApiDelegate.updateEmployeeEducation(id, body);
    }




}
