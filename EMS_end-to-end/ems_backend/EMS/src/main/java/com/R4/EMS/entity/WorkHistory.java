package com.R4.EMS.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.util.UUID;

@Entity
@Data
@Table(name = "work_history")
public class WorkHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "work_history_id")
    private UUID workHistoryId;

    @JoinColumn(name = "employee_id", nullable = false)
    private UUID employeeId;

    @Column(name = "company_name", nullable = false)
    private String companyName;

    @Column(name = "position")
    private String position;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(name = "industry")
    private String industry;

    @Column(name = "duties")
    private String duties;

    @Column(name = "manager_name")
    private String managerName;

    @Column(name = "reason_for_leaving")
    private String reasonForLeaving;

    @Column(name = "employer_name")
    private String employerName;

    @Column(name = "phone")
    private String phone;
}
