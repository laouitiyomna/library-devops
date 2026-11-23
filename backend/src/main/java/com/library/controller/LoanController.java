package com.library.controller;

import com.library.model.Loan;
import com.library.service.LoanService;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/loans")
public class LoanController {
    private final LoanService service;

    public LoanController(LoanService service) { this.service = service; }

    public record BorrowRequest(@NotNull Long bookId, @NotNull Long readerId) {}

    @GetMapping
    public List<Loan> list(@RequestParam(defaultValue = "false") boolean active) { return service.list(active); }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Loan borrow(@RequestBody BorrowRequest req) { return service.borrow(req.bookId(), req.readerId()); }

    @PutMapping("/{id}/return")
    public Loan giveBack(@PathVariable Long id) { return service.giveBack(id); }
}
