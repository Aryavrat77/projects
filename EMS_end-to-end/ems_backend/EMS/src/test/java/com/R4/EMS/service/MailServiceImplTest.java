package com.R4.EMS.service;

import com.R4.EMS.service.MailService;
import com.R4.EMS.service.impl.MailServiceImpl;
import jakarta.mail.internet.MimeMessage;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.lang.reflect.Field;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class MailServiceImplTest {

    @Mock
    private JavaMailSender javaMailSender;

    @Mock
    private MultipartFile multipartFile;

    @InjectMocks
    private MailServiceImpl mailService;

    @BeforeEach
    void setUp() throws Exception {
        MockitoAnnotations.openMocks(this);
        setField(mailService, "fromEmail", "test@example.com");
    }

    private void setField(Object target, String fieldName, Object value) throws Exception {
        Field field = target.getClass().getDeclaredField(fieldName);
        field.setAccessible(true);
        field.set(target, value);
    }

    @Test
    void testSendMailWithoutAttachments() {
        MimeMessage mimeMessage = mock(MimeMessage.class);
        when(javaMailSender.createMimeMessage()).thenReturn(mimeMessage);

        String to = "rishab.nuguru@gmail.com";
        String[] cc = {"cc@example.com"};
        String subject = "Test Subject";
        String body = "Test Body";

        String result = mailService.sendMail(null, to, cc, subject, body);

        assertEquals("Mail Sent!!!", result);
        verify(javaMailSender, times(1)).send(mimeMessage);
    }

    @Test
    void testSendMailWithAttachments() throws IOException {
        MimeMessage mimeMessage = mock(MimeMessage.class);
        when(javaMailSender.createMimeMessage()).thenReturn(mimeMessage);

        when(multipartFile.getOriginalFilename()).thenReturn("test.txt");
        when(multipartFile.getBytes()).thenReturn("Test Content".getBytes());

        String to = "rishab.nuguru@gmail.com";
        String[] cc = {"cc@example.com"};
        String subject = "Test Subject";
        String body = "Test Body";
        MultipartFile[] files = {multipartFile};

        String result = mailService.sendMail(files, to, cc, subject, body);

        assertEquals("Mail Sent!!!", result);
        verify(javaMailSender, times(1)).send(mimeMessage);
        verify(multipartFile, times(1)).getOriginalFilename();
        verify(multipartFile, times(1)).getBytes();
    }

    @Test
    void testSendMailThrowsException() {
        MimeMessage mimeMessage = mock(MimeMessage.class);
        when(javaMailSender.createMimeMessage()).thenReturn(mimeMessage);
        doThrow(new RuntimeException("Mail Error")).when(javaMailSender).send(any(MimeMessage.class));

        String to = "rishab.nuguru@gmail.com";
        String[] cc = {"cc@example.com"};
        String subject = "Test Subject";
        String body = "Test Body";

        assertThrows(RuntimeException.class, () -> mailService.sendMail(null, to, cc, subject, body));
        verify(javaMailSender, times(1)).send(mimeMessage);
    }
    
}
