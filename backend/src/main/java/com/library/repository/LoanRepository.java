package com.library.repository;

import com.library.model.Loan;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LoanRepository extends JpaRepository<Loan, Long> {
    List<Loan> findByReturnDateIsNull();
    long countByReaderIdAndReturnDateIsNull(Long readerId);
}
