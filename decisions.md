# Décisions techniques — laboratorepo

> Journal des décisions structurantes prises sur ce dépôt expérimental.
> Les décisions spécifiques à chaque branche/technologie sont dans `.agents/DECISIONS.md`.

---

## [2026-05-21] Dépôt expérimental monorepo par branche

**Contexte** : Besoin d'un dépôt pour explorer différentes technologies sans polluer des projets séparés.
**Décision** : Un seul dépôt Git avec une branche par technologie (`django`, `network`, etc.). Chaque branche est autonome et contient son propre code + documentation.
**Alternative écartée** : Un dépôt par technologie — trop de repos à gérer pour un usage personnel d'apprentissage.
**Conséquences** : Les branches ne sont pas destinées à être mergées sur `main`. `main` ne contient que le README racine.

---

## [2026-05-25] CI/CD avec SonarQube + Discord sur la branche `django`

**Contexte** : Apprentissage des pratiques DevOps (CI, qualité de code, notifications).
**Décision** : Pipeline GitHub Actions avec tests (coverage), lint (ruff), analyse SonarQube, et notifications Discord.
**Alternative écartée** : CI minimale sans SonarQube — moins formateur pour les pratiques professionnelles.
**Conséquences** : Requiert 4 secrets GitHub (`SONAR_HOST_URL`, `SONAR_PROD_TOKEN`, `SONAR_PREPROD_TOKEN`, `DISCORD_LOG`). Pipeline documenté dans le README.
