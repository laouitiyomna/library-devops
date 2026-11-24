# Fiche – Library DevOps

## Architecture

```
Développeur -> GitHub (branche + Pull Request) -> GitHub Actions (test -> docker-build)
Tag vX.Y.Z -> image ghcr.io/laouitiyomna/library-backend:vX.Y.Z (publiée une fois)
Staging (Docker Compose) : api (8080) -> db PostgreSQL (5432 non publié, volume pgdata-staging)
```

L'API joint la base par le nom du service `db`. Seul le port 8080 est exposé.

## Version mise en service

**v1.3.0** (`ghcr.io/laouitiyomna/library-backend:v1.3.0`), contrôlée par `/health` (`{"status":"ok"}`).

## Retour arrière (v1.4.0 vers v1.3.0)

1. v1.4.0 est publiée avec une erreur de configuration (`DB_HOSTNAME` au lieu de `DB_HOST`).
2. Détection : `wait-healthy.sh` échoue (code 1), les logs montrent `Could not resolve placeholder 'DB_HOSTNAME'`.
3. Décision : revenir à la dernière version saine, sans reconstruire.
4. Commandes :
   ```
   printf 'IMAGE_TAG=v1.3.0\n' > .env.deploy
   docker compose --env-file .env.deploy -f compose.staging.yaml up -d
   ./scripts/wait-healthy.sh; echo "Code: $?"
   ```
5. Vérification : `{"status":"ok"}`, code 0, données intactes (volume conservé).
6. Suite : corriger la config et publier une nouvelle version (v1.4.1). Un tag publié n'est jamais modifié.
