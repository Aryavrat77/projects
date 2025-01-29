package com.R4.EMS;

import com.R4.EMS.security.SecurityUser;
import com.R4.EMS.security.role.Roles;
import com.R4.EMS.service.AuthService;
import com.R4.generated.dto.LoginDto;
import com.R4.generated.dto.SignUpDto;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class EmsApplication {

    public static void main(String[] args) {
        SpringApplication.run(EmsApplication.class, args);
    }

   
}
