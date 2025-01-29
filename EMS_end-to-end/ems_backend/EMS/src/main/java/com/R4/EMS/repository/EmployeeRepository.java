package com.R4.EMS.repository;

import com.R4.EMS.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;
import java.util.Optional;


@Repository
public interface EmployeeRepository extends JpaRepository<Employee, UUID> {
    // You can define custom queries here if needed, using Spring Data JPA query methods or @Query annotation
    Optional<Employee> findByEmail(String email);


}
