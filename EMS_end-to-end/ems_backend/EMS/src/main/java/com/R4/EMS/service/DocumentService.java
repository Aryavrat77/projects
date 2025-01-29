package com.R4.EMS.service;

import com.R4.EMS.entity.Document;
import com.R4.EMS.repository.DocumentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Service class for managing documents.
 * This class handles business logic related to document operations.
 * It acts as an intermediary between the repository and controller layers,
 * ensuring that data access and business logic are decoupled.
 */
@Service
public class DocumentService {

    @Autowired
    private DocumentRepository documentRepository;

    public Document updateDocument(Document document) {
        Optional<Document> existingDocument = documentRepository.findById(document.getDocumentId());
        if (existingDocument.isPresent()) {
            Document docToUpdate = existingDocument.get();
            docToUpdate.setDocumentName(document.getDocumentName());
            docToUpdate.setDocumentType(document.getDocumentType());
            docToUpdate.setFilePath(document.getFilePath());
            docToUpdate.setUploadDate(document.getUploadDate());
            return documentRepository.save(docToUpdate);
        } else {
            throw new RuntimeException("Document not found with id " + document.getDocumentId());
        }
    }

    public List<Document> findAllDocuments() {
        return documentRepository.findAll();
    }

    public Optional<Document> findDocumentById(UUID id) {
        return documentRepository.findById(id);
    }

    public void deleteDocumentById(UUID id) {
        documentRepository.deleteById(id);
    }

    public List<Document> searchDocuments(Object criteria) {
        // Implement search logic based on criteria
        return documentRepository.findAll(); // Placeholder: Replace with actual search logic
    }
}
