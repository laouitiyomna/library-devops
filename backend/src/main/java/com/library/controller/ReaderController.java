package com.library.controller;

import com.library.exception.ApiException;
import com.library.model.Reader;
import com.library.repository.ReaderRepository;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/readers")
public class ReaderController {
    private final ReaderRepository repo;

    public ReaderController(ReaderRepository repo) { this.repo = repo; }

    @GetMapping
    public List<Reader> list(@RequestParam(required = false) String q) {
        if (q == null || q.isBlank()) return repo.findAll();
        return repo.findByNameContainingIgnoreCaseOrEmailContainingIgnoreCase(q, q);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Reader create(@Valid @RequestBody Reader r) {
        r.setId(null);
        return repo.save(r);
    }

    @PutMapping("/{id}")
    public Reader update(@PathVariable Long id, @Valid @RequestBody Reader data) {
        Reader r = repo.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Lecteur introuvable"));
        r.setName(data.getName());
        r.setEmail(data.getEmail());
        r.setPhone(data.getPhone());
        return repo.save(r);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        if (!repo.existsById(id)) throw new ApiException(HttpStatus.NOT_FOUND, "Lecteur introuvable");
        repo.deleteById(id);
        repo.flush();
    }
}
