package com.library.repository;

import com.library.model.Reader;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReaderRepository extends JpaRepository<Reader, Long> {
    List<Reader> findByNameContainingIgnoreCaseOrEmailContainingIgnoreCase(String name, String email);
}
