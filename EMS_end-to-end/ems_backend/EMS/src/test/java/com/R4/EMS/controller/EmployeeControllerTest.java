//package com.R4.EMS.controller;
//
//import com.R4.EMS.delegate.R4ApiDelegateImpl;
//import com.R4.generated.dto.EmployeeDto;
//import com.R4.EMS.controller.EmployeeController;
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.Test;
//import org.junit.jupiter.params.ParameterizedTest;
//import org.junit.jupiter.params.provider.NullAndEmptySource;
//import org.junit.jupiter.params.provider.ValueSource;
//import org.mockito.InjectMocks;
//import org.mockito.Mock;
//import org.mockito.MockitoAnnotations;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.MediaType;
//import org.springframework.http.ResponseEntity;
//import org.springframework.test.web.servlet.MockMvc;
//import org.springframework.test.web.servlet.setup.MockMvcBuilders;
//
//import java.util.Arrays;
//import java.util.UUID;
//
//import static org.mockito.ArgumentMatchers.any;
//import static org.mockito.ArgumentMatchers.eq;
//import static org.mockito.Mockito.*;
//import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
//import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
//import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
//
//import org.junit.jupiter.params.ParameterizedTest;
//import org.junit.jupiter.params.provider.ValueSource;
//import org.junit.jupiter.params.provider.NullAndEmptySource;
//import org.junit.jupiter.params.provider.NullSource;
//import static org.mockito.Mockito.when;
//import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
//import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
//import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
//import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
//
//public class EmployeeControllerTest {
//
//    private MockMvc mockMvc;
//
//    @Mock
//    private R4ApiDelegateImpl r4ApiDelegate;
//
//    @InjectMocks
//    private EmployeeController employeeController;
//
//    @BeforeEach
//    public void setup() {
//        MockitoAnnotations.openMocks(this);
//        mockMvc = MockMvcBuilders.standaloneSetup(employeeController).build();
//    }
//
//    @Test
//    public void getAllEmployeesTest() throws Exception {
//        when(r4ApiDelegate.getEmployees()).thenReturn(new ResponseEntity<>(Arrays.asList(new EmployeeDto()), HttpStatus.OK));
//
//        mockMvc.perform(get("/api/employees"))
//            .andExpect(status().isOk())
//            .andExpect(jsonPath("$").isArray());
//    }
//
//    @Test
//    public void getEmployeeByIdTest() throws Exception {
//        UUID id = UUID.randomUUID();
//        EmployeeDto employee = new EmployeeDto();
//        employee.setId(id);
//
//        when(r4ApiDelegate.getEmployeeById(id)).thenReturn(ResponseEntity.ok(employee));
//
//        mockMvc.perform(get("/api/employees/{id}", id.toString()))
//            .andExpect(status().isOk())
//            .andExpect(jsonPath("$.id").value(id.toString()));
//    }
//
//    @Test
//    public void createEmployeeTest() throws Exception {
//        EmployeeDto newEmployee = new EmployeeDto();
//        newEmployee.setFirstName("Rishab");
//        newEmployee.setLastName("Nuguru");
//
//        // Assuming createEmployee in the delegate correctly populates and returns the EmployeeDto
//        when(r4ApiDelegate.createEmployee(any(EmployeeDto.class))).thenReturn(new ResponseEntity<>(newEmployee, HttpStatus.CREATED));
//
//        mockMvc.perform(post("/api/employees")
//                .contentType(MediaType.APPLICATION_JSON)
//                .content("{\"first_name\":\"Rishab\", \"last_name\":\"Nuguru\"}")) // Correct JSON keys as per DTO
//            .andExpect(status().isCreated())
//            .andDo(print()) // This will print the full response to help debug
//            .andExpect(jsonPath("$.first_name").value("Rishab")) // Use snake_case as per DTO
//            .andExpect(jsonPath("$.last_name").value("Nuguru"));
//    }
//
//
//    @Test
//    public void updateEmployeeTest() throws Exception {
//        UUID id = UUID.randomUUID();
//        EmployeeDto updatedEmployee = new EmployeeDto();
//        updatedEmployee.setFirstName("Rishab");
//        updatedEmployee.setLastName("Nuguru");
//
//        when(r4ApiDelegate.updateEmployee(eq(id), any(EmployeeDto.class))).thenReturn(new ResponseEntity<>(HttpStatus.OK));
//
//        mockMvc.perform(put("/api/employees/{id}", id.toString())
//                .contentType(MediaType.APPLICATION_JSON)
//                .content("{\"firstName\":\"Rishab\", \"lastName\":\"Nuguru\"}"))
//            .andExpect(status().isOk());
//    }
//
//    @Test
//    public void deleteEmployeeTest() throws Exception {
//        UUID id = UUID.randomUUID();
//
//        when(r4ApiDelegate.deleteEmployee(id)).thenReturn(new ResponseEntity<Void>(HttpStatus.NO_CONTENT));
//
//        mockMvc.perform(delete("/api/employees/{id}", id.toString()))
//            .andExpect(status().isNoContent());
//    }
//
//    @ParameterizedTest
//    @ValueSource(strings = {"c56a4180-65aa-42ec-a945-5fd21dec0538", "not-a-uuid"})
//    @NullAndEmptySource  // Includes both null and empty string values
//    public void getEmployeeByIdParameterizedTest(String uuidStr) throws Exception {
//        if (uuidStr != null && !uuidStr.isEmpty()) {
//            try {
//                UUID id = UUID.fromString(uuidStr);
//                EmployeeDto employee = new EmployeeDto();
//                employee.setId(id);
//                when(r4ApiDelegate.getEmployeeById(id)).thenReturn(ResponseEntity.ok(employee));
//                mockMvc.perform(get("/api/employees/{id}", uuidStr))
//                    .andExpect(status().isOk())
//                    .andExpect(jsonPath("$.id").value(uuidStr))
//                    .andDo(print());
//            } catch (IllegalArgumentException e) {
//                mockMvc.perform(get("/api/employees/{id}", uuidStr))
//                    .andExpect(status().isBadRequest())
//                    .andDo(print());
//            }
//        } else {
//            mockMvc.perform(get("/api/employees/{id}", uuidStr == null ? "null" : "empty"))
//                .andExpect(status().isBadRequest())
//                .andDo(print());
//        }
//    }
//
//
//}
