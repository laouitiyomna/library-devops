package com.library.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

@Entity
public class Book {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NotBlank(message = "Le titre est obligatoire")
    private String title;
    @NotBlank(message = "L'auteur est obligatoire")
    private String author;
    private String isbn;
    private Integer publicationYear;
    @Min(value = 1, message = "Au moins 1 exemplaire")
    private int totalCopies = 1;
    private int availableCopies;

    public Book() {}

    public Book(String title, String author, String isbn, Integer year, int copies) {
        this.title = title; this.author = author; this.isbn = isbn;
        this.publicationYear = year; this.totalCopies = copies; this.availableCopies = copies;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getAuthor() { return author; }
    public void setAuthor(String author) { this.author = author; }
    public String getIsbn() { return isbn; }
    public void setIsbn(String isbn) { this.isbn = isbn; }
    public Integer getPublicationYear() { return publicationYear; }
    public void setPublicationYear(Integer publicationYear) { this.publicationYear = publicationYear; }
    public int getTotalCopies() { return totalCopies; }
    public void setTotalCopies(int totalCopies) { this.totalCopies = totalCopies; }
    public int getAvailableCopies() { return availableCopies; }
    public void setAvailableCopies(int availableCopies) { this.availableCopies = availableCopies; }
}
