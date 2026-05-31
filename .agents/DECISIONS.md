# DECISIONS.md — Journal des décisions techniques

> Rempli par l'agent IA au fil du projet, pour chaque choix structurant.  
> Objectif : permettre de comprendre "pourquoi" le code est comme il est, 2 mois plus tard.

---

## Format

```markdown
### [YYYY-MM-DD] [Titre court]
**Contexte** : Quel problème / besoin a motivé cette décision.
**Décision** : Ce qui a été choisi.
**Alternative écartée** : Ce qui a été considéré mais rejeté, et pourquoi.
**Conséquences** : Ce que ça implique (contraintes, dette, dépendances).
```

---

## Décisions

### [2026-05-21] SQLite comme base de données de développement

**Contexte** : Choix d'une base de données pour le projet tutoriel Django.
**Décision** : Utiliser SQLite (défaut Django) — aucune configuration serveur requise, adapté à un projet d'apprentissage.
**Alternative écartée** : PostgreSQL — surcharge opérationnelle inutile pour un projet non-production sans besoin de concurrence avancée.
**Conséquences** : Base de données dans un fichier `db.sqlite3` à la racine de `djangotutorial/`. Convient uniquement au développement local.

---

### [2026-05-21] Vues fonctionnelles (function-based views)

**Contexte** : Django offre deux approches pour les vues : fonctionnelles (FBV) et basées sur des classes (CBV).
**Décision** : Utiliser des FBV pour suivre fidèlement le tutoriel officiel Django et rester lisible.
**Alternative écartée** : CBV (`ListView`, `DetailView`) — plus concises mais opaques pour l'apprentissage ; introduites plus tard dans le tutoriel.
**Conséquences** : Les vues `index`, `detail`, `results`, `vote` sont toutes des fonctions dans `polls/views.py`.

---

### [2026-05-25] HttpResponse brut au lieu de templates HTML

**Contexte** : Les vues doivent retourner du contenu aux clients.
**Décision** : Retourner des `HttpResponse` avec du texte brut — étape intermédiaire du tutoriel avant l'introduction des templates.
**Alternative écartée** : Templates HTML dès le départ — prématuré par rapport à la progression pédagogique du tutoriel.
**Conséquences** : Interface non utilisable en production. Les templates seront ajoutés dans une étape ultérieure.

---

### [2026-05-25] Ruff comme unique outil de lint et formatage

**Contexte** : Choix d'un outil de qualité de code pour le projet Python/Django.
**Décision** : Utiliser `ruff` en remplacement de `flake8` + `isort` + `black` — un seul outil, très rapide, compatible Python 3.12.
**Alternative écartée** : `flake8` + `black` + `isort` séparés — configuration plus complexe, exécution plus lente, trois outils à maintenir.
**Conséquences** : `pyproject.toml` configure ruff avec les règles `E, W, F, I, N, UP`. La CI exécute `ruff check .` et `ruff format --check .`.

---

### [2026-05-25] Coverage XML pour intégration SonarQube

**Contexte** : La CI doit remonter la couverture de code à SonarQube.
**Décision** : Utiliser `coverage` pour générer `coverage.xml` (format Cobertura), uploadé en artefact CI et consommé par SonarQube.
**Alternative écartée** : Rapport HTML uniquement — non consommable par SonarQube.
**Conséquences** : `coverage.xml` est généré à chaque exécution de la CI. Le fichier est dans `.gitignore` (artefact de build). La config vit dans `pyproject.toml` (`[tool.coverage.*]`).

---

### [2026-05-25] Gestion des erreurs HTTP par retour direct (pas d'exception)

**Contexte** : Les vues doivent gérer les cas 404 (question inexistante) et 400 (vote invalide).
**Décision** : Retourner `HttpResponse(..., status=404/400)` directement plutôt que de lever `Http404` ou d'utiliser `get_object_or_404()`.
**Alternative écartée** : `get_object_or_404()` — plus idiomatique Django mais masque la logique de gestion d'erreur pour un projet d'apprentissage.
**Conséquences** : Code plus verbeux mais explicite. À refactorer avec `get_object_or_404()` si le projet évolue vers la production.
