//package com.R4.EMS.controller;
//
//import com.R4.EMS.delegate.R4ApiDelegateImpl;
//import com.R4.generated.dto.WorkHistoryDto;
//import com.fasterxml.jackson.databind.ObjectMapper;
//import org.junit.jupiter.api.Test;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
//import org.springframework.boot.test.mock.mockito.MockBean;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.MediaType;
//import org.springframework.http.ResponseEntity;
//import org.springframework.test.web.servlet.MockMvc;
//import org.springframework.web.server.ResponseStatusException;
//
//import java.util.Collections;
//import java.util.List;
//import java.util.UUID;
//
//import static org.hamcrest.Matchers.hasSize;
//import static org.mockito.ArgumentMatchers.any;
//import static org.mockito.ArgumentMatchers.eq;
//import static org.mockito.BDDMockito.given;
//import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
//import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
//import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
//
//@WebMvcTest(WorkHistoryController.class)
//public class WorkHistoryControllerTest {
//
//    @Autowired
//    private MockMvc mockMvc;
//
//    @MockBean
//    private R4ApiDelegateImpl r4ApiDelegate;
//
//    @Test
//    public void addEmployeeWorkHistoryTest() throws Exception {
//        UUID id = UUID.randomUUID();
//        WorkHistoryDto workHistory = new WorkHistoryDto();  // Assume this is populated appropriately
//
//        given(r4ApiDelegate.addEmployeeWorkHistory(eq(id), any(WorkHistoryDto.class)))
//                .willReturn(new ResponseEntity<>(HttpStatus.CREATED));
//
//        mockMvc.perform(post("/api/employees/{id}/workhistory", id.toString())
//                .contentType(MediaType.APPLICATION_JSON)
//                .content(new ObjectMapper().writeValueAsString(workHistory)))
//            .andExpect(status().isCreated());
//    }
//
//    @Test
//    public void deleteEmployeeWorkHistoryTest() throws Exception {
//        UUID id = UUID.randomUUID();
//
//        given(r4ApiDelegate.deleteEmployeeWorkHistory(id)).willReturn(new ResponseEntity<>(HttpStatus.NO_CONTENT));
//
//        mockMvc.perform(delete("/api/employees/{id}/workhistory", id.toString()))
//            .andExpect(status().isNoContent());
//    }
//
//    @Test
//    public void getEmployeeWorkHistoryTest() throws Exception {
//        UUID id = UUID.randomUUID();
//        List<WorkHistoryDto> historyList = Collections.singletonList(new WorkHistoryDto());
//
//        given(r4ApiDelegate.getEmployeeWorkHistory(id)).willReturn(ResponseEntity.ok(historyList));
//
//        mockMvc.perform(get("/api/employees/{id}/workhistory", id.toString()))
//            .andExpect(status().isOk())
//            .andExpect(jsonPath("$", hasSize(1)));
//    }
//
//    @Test
//    public void updateEmployeeWorkHistoryTest() throws Exception {
//        UUID id = UUID.randomUUID();
//        WorkHistoryDto workHistory = new WorkHistoryDto();  // Assume populated correctly
//
//        given(r4ApiDelegate.updateEmployeeWorkHistory(eq(id), any(WorkHistoryDto.class)))
//            .willReturn(new ResponseEntity<>(HttpStatus.OK));
//
//        mockMvc.perform(put("/api/employees/{id}/workhistory", id.toString())
//                .contentType(MediaType.APPLICATION_JSON)
//                .content(new ObjectMapper().writeValueAsString(workHistory)))
//            .andExpect(status().isOk());
//    }
//    @Test
//    public void addEmployeeWorkHistoryTest_InvalidInput() throws Exception {
//    UUID id = UUID.randomUUID();
//    WorkHistoryDto workHistory = new WorkHistoryDto(); // with invalid data
//
//    given(r4ApiDelegate.addEmployeeWorkHistory(eq(id), any(WorkHistoryDto.class)))
//            .willThrow(new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid data"));
//
//    mockMvc.perform(post("/api/employees/{id}/workhistory", id.toString())
//            .contentType(MediaType.APPLICATION_JSON)
//            .content(new ObjectMapper().writeValueAsString(workHistory)))
//        .andExpect(status().isBadRequest());
//    }
//
//    @Test
//    public void getEmployeeWorkHistoryTest_ServerError() throws Exception {
//    UUID id = UUID.randomUUID();
//
//    given(r4ApiDelegate.getEmployeeWorkHistory(id))
//            .willThrow(new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Server error"));
//
//    mockMvc.perform(get("/api/employees/{id}/workhistory", id.toString()))
//        .andExpect(status().isInternalServerError());
//    }
//
//    @Test
//    public void getEmployeeWorkHistoryTest_EmptyList() throws Exception {
//    UUID id = UUID.randomUUID();
//    List<WorkHistoryDto> emptyList = Collections.emptyList();
//
//    given(r4ApiDelegate.getEmployeeWorkHistory(id)).willReturn(ResponseEntity.ok(emptyList));
//
//    mockMvc.perform(get("/api/employees/{id}/workhistory", id.toString()))
//        .andExpect(status().isOk())
//        .andExpect(jsonPath("$", hasSize(0)));
//    }
//
//
//}
