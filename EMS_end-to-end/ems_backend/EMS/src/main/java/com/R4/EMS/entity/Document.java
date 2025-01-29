package com.R4.EMS.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.data.annotation.CreatedDate;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Entity class representing a Document within the EMS.
 */
@Entity
@Data
@Table(name = "documents")
public class Document {

    @Id
    @Column(name = "document_id", unique = true, nullable = false)
    private UUID documentId;

    @ManyToOne
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;  // Associates each document with a specific user.

    @NotBlank(message = "Document type is required.")
    @Column(name = "document_type", nullable = false)
    private String documentType;

    @NotBlank(message = "Document name is required.")
    @Size(max = 255, message = "Document name must not exceed 255 characters.")
    @Column(name = "document_name", nullable = false)
    private String documentName;

    @NotBlank(message = "File path is required.")
    @Column(name = "file_path", nullable = false)
    private String filePath;

    @CreatedDate
    @Column(name = "upload_date", nullable = false, updatable = false)
    private LocalDateTime uploadDate;

    // Note: If not using Lombok, ensure to manually add constructors, getters, and setters.
}
