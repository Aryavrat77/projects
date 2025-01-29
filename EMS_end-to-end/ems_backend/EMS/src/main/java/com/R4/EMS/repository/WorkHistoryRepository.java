package com.R4.EMS.repository;

import com.R4.EMS.entity.WorkHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface WorkHistoryRepository extends JpaRepository<WorkHistory, UUID> {

    WorkHistory findByEmployeeId(UUID id);

    List<WorkHistory> findAllByEmployeeId(UUID id);
}
