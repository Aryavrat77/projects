package com.R4.EMS.controller;

import com.R4.EMS.delegate.R4ApiDelegateImpl;
import com.R4.generated.dto.WorkHistoryDto;
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
public class WorkHistoryController {

    @Autowired
    R4ApiDelegateImpl r4ApiDelegate;

    @Operation(summary = "Add work history for an employee", description = "", tags={ "Employees" })
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Work history added successfully") })
    @PostMapping("/{id}/workhistory")
    public ResponseEntity<WorkHistoryDto> addEmployeeWorkHistory(@PathVariable("id") UUID id, @Valid @RequestBody WorkHistoryDto body) {
        return r4ApiDelegate.addEmployeeWorkHistory(id, body);
    }

    @Operation(summary = "Delete an employee's work history entry", description = "", tags={ "Employees" })
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Work history entry deleted successfully") })
    @DeleteMapping("/{id}/workhistory")
    public ResponseEntity<Void> deleteEmployeeWorkHistory(@PathVariable("id") UUID id) {
        return r4ApiDelegate.deleteEmployeeWorkHistory(id);
    }


    @Operation(summary = "Retrieve the work history of an employee by ID", description = "", tags={ "Employees" })
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Employee work history details", content = @Content(mediaType = "application/json", array = @ArraySchema(schema = @Schema(implementation = WorkHistoryDto.class)))) })
    @GetMapping( "/{id}/workhistory")
    public ResponseEntity<List<WorkHistoryDto>> getEmployeeWorkHistory(@PathVariable("id") UUID id) {
        return r4ApiDelegate.getEmployeeWorkHistory(id);
    }


    @Operation(summary = "Update an employee's work history", description = "", tags={ "Employees" })
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Work history updated successfully") })
    @PutMapping(value = "/{id}/workhistory")
    public ResponseEntity<Void> updateEmployeeWorkHistory(@PathVariable("id") UUID id, @Valid @RequestBody WorkHistoryDto body) {
        return r4ApiDelegate.updateEmployeeWorkHistory(id, body);
    }
}
