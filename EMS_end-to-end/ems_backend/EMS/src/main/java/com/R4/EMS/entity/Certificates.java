package com.R4.EMS.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.util.UUID;

@Entity
@Data
@Table(name = "certificates")
public class Certificates {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id")
    private UUID id;

    @JoinColumn(name = "education_id", nullable = false)
    private UUID educationId;

    @Column(name = "certificate")
    private String certificate;
}
