package com.library;

import com.library.model.Book;
import com.library.model.Reader;
import com.library.repository.BookRepository;
import com.library.repository.ReaderRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@SpringBootApplication
public class LibraryApplication {

    public static void main(String[] args) {
        SpringApplication.run(LibraryApplication.class, args);
    }

    @Bean
    WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                        .allowedOrigins("http://localhost:4200")
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS");
            }
        };
    }

    /** Données de démonstration au premier lancement. */
    @Bean
    CommandLineRunner initData(BookRepository books, ReaderRepository readers) {
        return args -> {
            if (books.count() == 0) {
                books.save(new Book("Le Petit Prince", "Antoine de Saint-Exupéry", "9782070612758", 1943, 3));
                books.save(new Book("L'Étranger", "Albert Camus", "9782070360024", 1942, 2));
                books.save(new Book("Les Misérables", "Victor Hugo", "9782253096344", 1862, 1));
            }
            if (readers.count() == 0) {
                readers.save(new Reader("Ahmed Ben Ali", "ahmed@example.com", "20123456"));
                readers.save(new Reader("Sarra Trabelsi", "sarra@example.com", "22987654"));
            }
        };
    }
}
