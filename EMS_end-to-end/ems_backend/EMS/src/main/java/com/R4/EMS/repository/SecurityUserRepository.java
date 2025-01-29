package com.R4.EMS.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.R4.EMS.entity.Employee;
import com.R4.EMS.security.SecurityUser;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface SecurityUserRepository extends JpaRepository<SecurityUser, UUID> {
    Optional<SecurityUser> findByEmployee(Employee employee);
}
