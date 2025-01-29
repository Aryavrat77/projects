package com.R4.EMS.controller;

import com.R4.EMS.service.MailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/mail")
public class MailController {

    @Autowired
    private MailService mailService;

    @PostMapping
    public String sendMail (
        @RequestParam(value = "file", required = false) MultipartFile[] files,
        @RequestParam("to") String to,
        @RequestParam(value = "cc", required = false) String[] cc,
        @RequestParam("subject") String subject,
        @RequestParam("body") String body) {
            return mailService.sendMail(files, to, cc, subject, body);
    }
}
