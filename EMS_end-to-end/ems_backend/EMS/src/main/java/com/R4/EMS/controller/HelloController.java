package com.R4.EMS.controller;

import org.springframework.web.bind.annotation.RestController;

import com.R4.EMS.security.JwtToPrincipalConverter.UserPrincipal;

import lombok.RequiredArgsConstructor;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@RequiredArgsConstructor
public class HelloController {

    @GetMapping("/testing")
    public String welcome() {
        return "Welcome to my Testing";
    }

    @GetMapping("/secured")
    public String secured(@AuthenticationPrincipal UserPrincipal principal) {
        return "if you see this, you are logged in " + principal.getEmail()
        + "User ID:" + principal.getUserId();

    }
    
    
    
}
