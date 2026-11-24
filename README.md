# Library – projet DevOps

Application de gestion de bibliothèque : backend Spring Boot 3.2.5 (Java 17, Maven) + frontend Angular 17.

## Démarrer en une commande

Prérequis : Docker avec Docker Compose.

```
cp .env.example .env && docker compose up --build -d
```

Vérifier : `curl http://localhost:8080/health` renvoie `{"status":"ok"}`.
Arrêter : `docker compose down` (garde les données) ou `docker compose down -v` (supprime aussi les données).

## Frontend (développement)

```
cd frontend && npm install && npx ng serve
```
Ouvrir http://localhost:4200

## Contrôle et tests

- `./scripts/check-project.sh` : vérifie les fichiers obligatoires et l'absence de `.env` suivi (code 0 = OK, 1 = erreur).
- `cd backend && mvn -B test` : tests JUnit.

## CI/CD

- Pull Request : script de contrôle, tests, puis construction de l'image (`needs`). Rapport de tests en artefact.
- Tag `vX.Y.Z` : image publiée sur `ghcr.io/laouitiyomna/library-backend:vX.Y.Z`, jamais reconstruite.
- Staging : `compose.staging.yaml` avec `IMAGE_TAG`, contrôle par `scripts/wait-healthy.sh`.

## Preuves

- Pipeline réussi : <URL_RUN_VERT>
- Pipeline en échec : <URL_RUN_ROUGE>

Fiche d'une page : [docs/fiche.md](docs/fiche.md) – Incident et retour arrière : [docs/incident-rollback.md](docs/incident-rollback.md)
