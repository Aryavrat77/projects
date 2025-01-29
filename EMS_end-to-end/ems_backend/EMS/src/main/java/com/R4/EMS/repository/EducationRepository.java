package com.R4.EMS.repository;

import com.R4.EMS.entity.Education;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface EducationRepository extends JpaRepository<Education, UUID> {

    Education findByEmployeeId(UUID id);

    List<Education> findAllByEmployeeId(UUID id);
}
