package com.R4.EMS.service;

import org.springframework.web.multipart.MultipartFile;

public interface MailService {
    String sendMail(MultipartFile[] files, String to, String[] cc, String subject, String body);
}
