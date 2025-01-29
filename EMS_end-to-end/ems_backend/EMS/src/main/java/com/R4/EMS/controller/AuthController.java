package com.R4.EMS.controller;

import com.R4.EMS.delegate.R4ApiDelegateImpl;
import com.R4.EMS.exception.InvalidCredentialsException;
import com.R4.EMS.exception.UserDisabledException;
import com.R4.EMS.service.AuthService;
import com.R4.generated.dto.LoginDto;
import com.R4.generated.dto.SignUpDto;
import com.R4.generated.dto.UserDto;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
@CrossOrigin(origins = "http://54.213.40.3:3000")
public class AuthController {

    @Autowired
    private final R4ApiDelegateImpl r4ApiDelegate;

    @PostMapping("/login")
    public ResponseEntity<AuthService.AuthResponse> login(@RequestBody LoginDto loginDto) {
        try {
            return r4ApiDelegate.login(loginDto);
        } catch (InvalidCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new AuthService.AuthResponse(e.getMessage(), null));
        } catch (UserDisabledException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(new AuthService.AuthResponse(e.getMessage(), null));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new AuthService.AuthResponse("Login failed", null));
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<UserDto> signup(@RequestBody SignUpDto signUpDto) {
        try {
            return r4ApiDelegate.signup(signUpDto);
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
