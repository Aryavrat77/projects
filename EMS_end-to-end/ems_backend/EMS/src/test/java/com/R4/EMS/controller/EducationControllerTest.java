//package com.R4.EMS.controller;
//
//import com.R4.EMS.configuration.WebSecurityConfig;
//import com.R4.EMS.delegate.R4ApiDelegateImpl;
//import com.R4.EMS.entity.Education;
//import com.R4.EMS.security.JwtDecoder;
//import com.R4.EMS.security.JwtToPrincipalConverter;
//import com.R4.generated.dto.EducationDto;
//import com.fasterxml.jackson.databind.ObjectMapper;
//import com.fasterxml.jackson.databind.ObjectWriter;
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.Test;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
//import org.springframework.boot.test.mock.mockito.MockBean;
//import org.springframework.context.annotation.Import;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.MediaType;
//import org.springframework.http.ResponseEntity;
//import org.springframework.test.web.servlet.MockMvc;
//import org.springframework.web.server.ResponseStatusException;
//
//import java.util.List;
//import java.util.UUID;
//
//import static org.mockito.ArgumentMatchers.any;
//import static org.mockito.ArgumentMatchers.eq;
//import static org.mockito.BDDMockito.given;
//import static org.mockito.Mockito.when;
//import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
//import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
//import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
//
//@WebMvcTest(EducationController.class)
//@Import({WebSecurityConfig.class})
//public class EducationControllerTest {
//
//
//    @Autowired
//    private MockMvc mockMvc;
//
//    @MockBean
//    private R4ApiDelegateImpl r4ApiDelegate;
//
//    private Education education;
//
//    @MockBean
//    JwtDecoder jwtDecoder;
//
//    @MockBean
//    JwtToPrincipalConverter jwtToPrincipalConverter;
//
//    @BeforeEach
//    void setUp(){
//
//        education = new Education();
//        education.setUniversityName("test_university");
//        education.setCity("test_city");
//    }
//
//    @Test
//    public void testAddEmployeeEducation() throws Exception {
//
//        UUID id = UUID.randomUUID();
//        ObjectMapper mapper = new ObjectMapper();
//        ObjectWriter writer = mapper.writer().withDefaultPrettyPrinter();
//        String requestJson = writer.writeValueAsString(education);
//
//        when(r4ApiDelegate.addEmployeeEducation(eq(id), any(EducationDto.class)))
//                .thenReturn(new ResponseEntity<>(HttpStatus.CREATED));
//        mockMvc.perform(post("/api/employees/" +id +"/education")
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(requestJson))
//                .andDo(print()).andExpect(status().isCreated());
//    }
//
//    @Test
//    public void testUpdateEmployeeEducation() throws Exception {
//
//        UUID id = UUID.randomUUID();
//        ObjectMapper mapper = new ObjectMapper();
//        ObjectWriter writer = mapper.writer().withDefaultPrettyPrinter();
//        String requestJson = writer.writeValueAsString(education);
//
//        when(r4ApiDelegate.updateEmployeeEducation(eq(id), any(EducationDto.class)))
//                .thenReturn(new ResponseEntity<>(HttpStatus.OK));
//
//        mockMvc.perform(put("/api/employees/" +id +"/education")
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(requestJson))
//                .andDo(print()).andExpect(status().isOk());
//
//    }
//
//    @Test
//    public void testGetEmployeeEducation() throws Exception {
//
//        UUID id = UUID.randomUUID();
//        when(r4ApiDelegate.getEmployeeEducation(eq(id)))
//                .thenReturn(new ResponseEntity<>(List.of(new EducationDto()), HttpStatus.OK));
//
//        mockMvc.perform(get("/api/employees/" +id +"/education"))
//                .andDo(print()).andExpect(status().isOk());
//    }
//
//    @Test
//    public void testDeleteEmployeeEducation() throws Exception{
//
//        UUID id = UUID.randomUUID();
//        when(r4ApiDelegate.deleteEmployeeEducation(eq(id)))
//                .thenReturn(new ResponseEntity<>(HttpStatus.NO_CONTENT));
//
//        mockMvc.perform(delete("/api/employees/" +id +"/education"))
//                .andDo(print()).andExpect(status().isNoContent());
//
//    }
//
//    @Test
//    public void addEmployeeEducationTest_InvalidInput() throws Exception {
//        UUID id = UUID.randomUUID();
//        EducationDto education = new EducationDto();
//
//        given(r4ApiDelegate.addEmployeeEducation(eq(id), any(EducationDto.class)))
//                .willThrow(new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid data"));
//
//        mockMvc.perform(post("/api/employees/{id}/education", id.toString())
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(new ObjectMapper().writeValueAsString(education)))
//                .andExpect(status().isBadRequest());
//    }
//}