//package com.R4.EMS.controller;
//
//import com.R4.EMS.security.JwtDecoder;
//import com.R4.EMS.security.JwtToPrincipalConverter;
//import com.R4.EMS.service.MailService;
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.Test;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
//import org.springframework.boot.test.mock.mockito.MockBean;
//import org.springframework.mock.web.MockMultipartFile;
//import org.springframework.test.web.servlet.MockMvc;
//import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
//
//import static org.mockito.ArgumentMatchers.any;
//import static org.mockito.Mockito.verify;
//import static org.mockito.Mockito.when;
//import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
//import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
//import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
//
//@WebMvcTest(MailController.class)
//public class MailControllerTest {
//
//    @Autowired
//    MockMvc mockMvc;
//
//    @MockBean
//    MailService mailService;
//
//    @MockBean
//    JwtDecoder jwtDecoder;
//
//    @MockBean
//    JwtToPrincipalConverter jwtToPrincipalConverter;
//
//    String to, subject, body;
//    String[] cc;
//
//    MockMultipartFile[] file;
//
//    @BeforeEach
//    void setUp(){
//        to = "test@mail.com";
//        subject = "test subject";
//        body = "test body";
//        cc = new String[]{"test1@mail.com", "test2@mail.com"};
//        file = new MockMultipartFile[]{new MockMultipartFile("file", "test1.txt", "text/plain", "test, body 1!".getBytes()),
//                new MockMultipartFile("file", "test2.txt", "text/plain", "test, body 2!".getBytes())};
//    }
//
//    @Test
//    public void testSendMail() throws Exception{
//
//        when(mailService.sendMail(any(), any(), any(), any(), any())).thenReturn("Email sent successfully");
//
//        mockMvc.perform(MockMvcRequestBuilders.multipart("/api/employees/mail")
//                .file(file[0])
//                .file(file[1])
//                .param("to", to)
//                .param("cc", cc)
//                .param("subject", subject)
//                .param("body", body))
//                .andDo(print())
//                .andExpect(status().isOk())
//                .andExpect(content().string("Email sent successfully"));
//        verify(mailService).sendMail(any(), any(), any(), any(), any());
//    }
//}
