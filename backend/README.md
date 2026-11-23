# Library backend (Spring Boot 3 / Java 17)

    mvn spring-boot:run

API : http://localhost:8080/api  |  Console H2 : http://localhost:8080/h2-console
(JDBC URL : jdbc:h2:file:./data/librarydb, user : sa, mot de passe vide)

Endpoints :
- GET/POST /api/books, GET/PUT/DELETE /api/books/{id}, recherche : /api/books?q=texte
- GET/POST /api/readers, PUT/DELETE /api/readers/{id}
- GET /api/loans?active=true, POST /api/loans {bookId, readerId}, PUT /api/loans/{id}/return
