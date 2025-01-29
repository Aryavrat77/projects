package com.R4.EMS.repository;

import com.R4.EMS.security.SecurityUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<SecurityUser, UUID> {
    Optional<SecurityUser> findByEmail(String email);

    @Query("SELECT u.role FROM SecurityUser u WHERE u.email = :email")
    String findRoleByEmail(@Param("email") String email);
}
