# CONVENTIONS.md — Conventions du projet

> Fichier spécifique à ce projet. Rempli au démarrage, mis à jour si les conventions évoluent.
> L'agent IA doit lire ce fichier avant toute implémentation.

---

## Stack technique

| Élément             | Valeur                                               |
| ------------------- | ---------------------------------------------------- |
| Langage principal   | Python                                               |
| Runtime             | `Python 3.12`                                        |
| Framework principal | Django 6.0.1                                         |
| Base de données     | SQLite (développement) — configurable via settings   |
| ORM                 | Django ORM natif                                     |
| Tests               | `django.test.TestCase` (unittest) + `coverage`       |
| Linter / Formatter  | `ruff` (check + format) — cible Python 3.12, 88 cars |

---

## Structure de dossiers

```
djangotutorial/
├── manage.py
├── requirements.txt          # Django, ruff, coverage
├── pyproject.toml            # Configuration ruff + coverage
├── coverage.xml              # Généré par la CI (ne pas versionner)
├── mysite/
│   ├── settings.py           # Paramètres globaux du projet Django
│   ├── urls.py               # Routeur racine (inclut polls.urls)
│   ├── asgi.py
│   └── wsgi.py
└── polls/
    ├── models.py             # Modèles Question et Choice
    ├── views.py              # Vues fonctionnelles (pas de class-based views)
    ├── urls.py               # Routes nommées, app_name = "polls"
    ├── admin.py              # Enregistrement admin
    ├── tests.py              # Tests unitaires Django (26 tests)
    ├── apps.py
    └── migrations/
        └── 0001_initial.py
```

---

## Nommage

| Élément              | Convention         | Exemple                  |
| -------------------- | ------------------ | ------------------------ |
| Fichiers             | `snake_case`       | `user_service.py`        |
| Classes / Modèles    | `PascalCase`       | `Question`, `Choice`     |
| Fonctions / méthodes | `snake_case`       | `was_published_recently` |
| Variables            | `snake_case`       | `latest_questions`       |
| Constantes           | `UPPER_SNAKE_CASE` | `MAX_RETRY_COUNT`        |
| Tables DB (Django)   | `app_modelname`    | `polls_question`         |
| Noms d'URL (named)   | `snake_case`       | `name="index"`           |

---

## Règles spécifiques au projet

- Les vues sont des **fonctions** (function-based views), pas des class-based views — respecter le tutoriel Django officiel.
- Pas de logique métier dans les vues : la logique doit aller dans les modèles ou des services dédiés.
- Les réponses sont des `HttpResponse` brutes (pas de templates HTML pour l'instant — étape future du tutoriel).
- Les erreurs HTTP sont retournées directement (`status=404`, `status=400`) sans lever d'exception Django (`Http404`).
- Les migrations sont générées par `makemigrations` et ne sont jamais modifiées à la main.
- Les tests utilisent `django.test.TestCase` et les helpers `create_question` / `add_choice` définis dans `tests.py`.
- Noms de tests : `[méthode ou vue] - [contexte] - [résultat attendu]` (traduit en `test_<snake_case>`).
- Ruff est le seul outil de lint/format — ne pas introduire black, flake8, isort séparément.

---

## Ce qui est hors-scope pour ce projet

- Ce dépôt est **expérimental** (apprentissage Django) — ne pas viser la production.
- Pas de templates HTML ni de frontend pour l'instant (les vues retournent du texte brut).
- Pas d'authentification ni de gestion de permissions utilisateur.
- Pas de pagination, de filtres avancés, ou d'API REST dédiée.

---

## Dépendances autorisées

| Usage      | Librairie approuvée                  |
| ---------- | ------------------------------------ |
| Framework  | `Django 6.0.1`                       |
| Tests      | `coverage` (rapport + XML SonarQube) |
| Lint/format| `ruff`                               |
