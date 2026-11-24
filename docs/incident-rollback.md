# Compte rendu d'incident : mise en service de v1.4.0

- **Ce qui s'est passé** : v1.4.0 contenait une faute dans application-prod.properties (DB_HOSTNAME au lieu de DB_HOST). L'API ne démarrait pas en staging.
- **Détection** : scripts/wait-healthy.sh a échoué (code non nul) ; les journaux indiquent "Could not resolve placeholder 'DB_HOSTNAME'".
- **Action** : retour à v1.3.0 en remettant IMAGE_TAG=v1.3.0 puis docker compose up -d, sans reconstruction de l'image.
- **Durée d'indisponibilité** : ___ minutes (de HH:MM à HH:MM).
- **Prévention** : ajouter un test avec le profil prod et conserver le contrôle de santé obligatoire après chaque mise en service.
