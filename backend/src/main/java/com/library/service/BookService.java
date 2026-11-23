package com.library.service;

import com.library.exception.ApiException;
import com.library.model.Book;
import com.library.repository.BookRepository;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class BookService {
    private final BookRepository repo;

    public BookService(BookRepository repo) { this.repo = repo; }

    public List<Book> search(String q) {
        if (q == null || q.isBlank()) return repo.findAll();
        return repo.findByTitleContainingIgnoreCaseOrAuthorContainingIgnoreCaseOrIsbnContainingIgnoreCase(q, q, q);
    }

    public Book get(Long id) {
        return repo.findById(id).orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Livre introuvable"));
    }

    @Transactional
    public Book create(Book b) {
        b.setId(null);
        b.setAvailableCopies(b.getTotalCopies());
        return repo.save(b);
    }

    @Transactional
    public Book update(Long id, Book data) {
        Book b = get(id);
        int borrowed = b.getTotalCopies() - b.getAvailableCopies();
        if (data.getTotalCopies() < borrowed) {
            throw new ApiException(HttpStatus.BAD_REQUEST,
                    "Le nombre d'exemplaires ne peut pas être inférieur aux exemplaires empruntés (" + borrowed + ")");
        }
        b.setTitle(data.getTitle());
        b.setAuthor(data.getAuthor());
        b.setIsbn(data.getIsbn());
        b.setPublicationYear(data.getPublicationYear());
        b.setTotalCopies(data.getTotalCopies());
        b.setAvailableCopies(data.getTotalCopies() - borrowed);
        return repo.save(b);
    }

    public void delete(Long id) {
        repo.delete(get(id));
        repo.flush();
    }
}
