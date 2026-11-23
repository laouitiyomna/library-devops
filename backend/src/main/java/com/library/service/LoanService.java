package com.library.service;

import com.library.exception.ApiException;
import com.library.model.Book;
import com.library.model.Loan;
import com.library.model.Reader;
import com.library.repository.BookRepository;
import com.library.repository.LoanRepository;
import com.library.repository.ReaderRepository;
import java.time.LocalDate;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class LoanService {
    private static final int LOAN_DAYS = 14;
    private static final int MAX_ACTIVE_LOANS = 5;

    private final LoanRepository loans;
    private final BookRepository books;
    private final ReaderRepository readers;

    public LoanService(LoanRepository loans, BookRepository books, ReaderRepository readers) {
        this.loans = loans; this.books = books; this.readers = readers;
    }

    public List<Loan> list(boolean activeOnly) {
        return activeOnly ? loans.findByReturnDateIsNull() : loans.findAll();
    }

    @Transactional
    public Loan borrow(Long bookId, Long readerId) {
        Book book = books.findById(bookId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Livre introuvable"));
        Reader reader = readers.findById(readerId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Lecteur introuvable"));
        if (book.getAvailableCopies() <= 0)
            throw new ApiException(HttpStatus.BAD_REQUEST, "Aucun exemplaire disponible");
        if (loans.countByReaderIdAndReturnDateIsNull(readerId) >= MAX_ACTIVE_LOANS)
            throw new ApiException(HttpStatus.BAD_REQUEST,
                    "Ce lecteur a déjà " + MAX_ACTIVE_LOANS + " emprunts en cours");

        book.setAvailableCopies(book.getAvailableCopies() - 1);
        Loan loan = new Loan();
        loan.setBook(book);
        loan.setReader(reader);
        loan.setLoanDate(LocalDate.now());
        loan.setDueDate(LocalDate.now().plusDays(LOAN_DAYS));
        return loans.save(loan);
    }

    @Transactional
    public Loan giveBack(Long loanId) {
        Loan loan = loans.findById(loanId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Emprunt introuvable"));
        if (loan.getReturnDate() != null)
            throw new ApiException(HttpStatus.BAD_REQUEST, "Livre déjà retourné");
        loan.setReturnDate(LocalDate.now());
        Book book = loan.getBook();
        book.setAvailableCopies(book.getAvailableCopies() + 1);
        return loan;
    }
}
