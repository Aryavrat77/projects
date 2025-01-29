package com.R4.EMS.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.util.UUID;

@Entity
@Data
@Table(name = "education_history")
public class Education {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "education_id")
    private UUID educationId;

    @JoinColumn(name = "employee_id", nullable = false)
    private UUID employeeId;

    @Column(name = "university_name")
    private String universityName;

    @Column(name = "college_name")
    private String collegeName;

    @Column(name = "degree_type")
    private String degreeType;

    @Column(name = "advanced_degree_type")
    private String advancedDegreeType;

    @Column(name = "major")
    private String major;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(name = "city")
    private String city;

    @Column(name = "state")
    private String state;

    @Column(name = "country")
    private String country;
}
