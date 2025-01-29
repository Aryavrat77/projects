package com.R4.EMS.entity;

import com.R4.generated.dto.Roles;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Data
@Table(name = "employees")
public class Employee {

    @Id
    @Column(name = "employee_id", updatable = false, nullable = false)
    private UUID id;

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    @Column
    private String middleName;

    @Column
    private String cellPhone;

    @Column
    private String previousNames;

    @Column
    private String preferredName;

    @Column
    private String homeAddress;

    @Column
    private String city;

    @Column
    private String state;

    @Column
    private String zipCode;

    @Column(nullable = false, unique = true)
    private String email;

    @Column
    private String jobTitle;

    @Column
    private String jobType;

    @Column
    private LocalDate availableStartDate;

    @Column
    private String noticePeriod;

    @Column
    private Boolean nonCompete;

    @Column
    private Boolean driversLicense;

    @Column
    private Boolean licenseSuspended;

    @Column
    private Boolean hasTransportation;

    @Column
    private Boolean canVisitClients;

    @Column
    private Boolean rightToWork;

    @Column
    private Boolean needSponsorship;

    @Column
    private Boolean covidVaccinated;

    @Column
    private Boolean willGetVaccinated;

    @Column
    private Boolean currentEmployment;

    @Column
    private Boolean mayContactCurrentEmployer;

    @Column
    private Boolean clientEmployment;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Roles role;

    @Column
    private String clientNames;

    @Column
    private Boolean preventServicingClients;

    @Column
    private Boolean r4EmployeeReferral;

    @Column
    private String r4EmployeeReferralName;

    @Column
    private String reasonForLooking;

    @Column
    private Boolean highSchoolDiploma;

    @Column
    private Boolean collegeDegree;

    @Column
    private String highestEducationLevel;

    @Column
    private String certifications;

    @Column
    private String skills;

    @ElementCollection
    @CollectionTable(name = "employee_heard_about_r4", joinColumns = @JoinColumn(name = "employee_id"))
    private List<String> heardAboutR4 = new ArrayList<>();

    @Column
    private String reasonsNoContact;

    @Column
    private Boolean authorizeVerification;

    @Column
    private String signatureDate;

    @Enumerated(EnumType.STRING)
    @Column
    private EmploymentTypeEnum employmentType;

    @Embedded
    private Availability availability;

    @Data
    @Embeddable
    public static class Availability {
        private Boolean overtime;
        private Boolean weekends;
        private Boolean holidays;
        private Boolean secondShift;
        private Boolean thirdShift;
        private Boolean flexSchedule;
        private Boolean nonStandardSchedule;
    }

    public enum EmploymentTypeEnum {
        FULL_TIME, PART_TIME, CONTRACT
    }

    // Constructor without ID to be used for new entities
    public Employee(String firstName, String lastName, String email) {
        this.id = UUID.randomUUID(); // Generate UUID here if needed
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
    }

    // Default constructor for JPA
    public Employee() {}
}
