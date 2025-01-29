package com.R4.EMS.repository;

import com.R4.EMS.entity.Document;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

/**
 * Spring Data repository interface for the Document entity.
 * This interface handles database operations for documents,
 * leveraging Spring Data JPA's built-in methods for CRUD operations and more.
 */
@Repository
public interface DocumentRepository extends JpaRepository<Document, UUID> {
    // Custom database queries can be defined here if needed
}
