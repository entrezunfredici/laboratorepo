# laboratorepo

Dépôt expérimental personnel — utilisé pour tester et découvrir de nouvelles technologies ou processus. Le code n'est pas destiné à la production.

---

## Sommaire

- [Django](#django)

---

## Django

> Branche : `django`

Suivi du [tutoriel officiel Django](https://docs.djangoproject.com/en/6.0/intro/tutorial01/) avec Django 6.0.1.

### Prérequis

- Python 3.x
- Django installé : `pip install django`
- Vérifier la version : `python -m django --version`

### Structure du projet

```
djangotutorial/
├── manage.py
├── requirements.txt          # Django, ruff, coverage
├── pyproject.toml            # Configuration ruff + coverage
├── coverage.xml              # Rapport de couverture (généré par la CI)
├── mysite/
│   ├── settings.py
│   ├── urls.py
│   ├── asgi.py
│   └── wsgi.py
└── polls/
    ├── models.py             # Modèles Question et Choice
    ├── views.py              # Vues index, detail, results, vote
    ├── urls.py               # Routes nommées (app_name = "polls")
    ├── admin.py              # Enregistrement admin
    ├── tests.py              # 26 tests unitaires documentés
    ├── apps.py
    └── migrations/
        └── 0001_initial.py   # Création de Question et Choice
```

### Démarrage

#### 1. Créer le projet (déjà fait)

```bash
django-admin startproject mysite djangotutorial
```

#### 2. Appliquer les migrations initiales

Django fournit par défaut des applications intégrées (`admin`, `auth`, `contenttypes`, `sessions`) qui nécessitent des tables en base de données. Cette commande crée la base SQLite et applique toutes les migrations :

```bash
python djangotutorial/manage.py migrate
```

> Sans cette étape, Django affiche un avertissement au démarrage et certaines fonctionnalités (authentification, admin, sessions) ne fonctionnent pas.

#### 3. Lancer le serveur de développement

```bash
python djangotutorial/manage.py runserver
```

Le serveur démarre sur [http://127.0.0.1:8000/](http://127.0.0.1:8000/).

> Ce serveur est uniquement destiné au développement local. Ne pas l'utiliser en production — utiliser Gunicorn/uWSGI + un reverse proxy (nginx) à la place.

---

### Création de l'application `polls`

#### 1. Créer l'application

```bash
cd djangotutorial
python manage.py startapp polls
```

Cela génère le dossier `polls/` avec la structure Django standard.

#### 2. Première vue (`polls/views.py`)

```python
from django.http import HttpResponse

def index(request):
    return HttpResponse("Hello, world. You're at the polls index.")
```

#### 3. Router les URLs de polls (`polls/urls.py`)

```python
from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name="index"),
]
```

#### 4. Brancher polls dans le projet (`mysite/urls.py`)

Ajout de `include` et du pattern vers l'app polls :

```python
from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path("polls/", include("polls.urls")),
    path("admin/", admin.site.urls),
]
```

La vue index est maintenant accessible sur [http://127.0.0.1:8000/polls/](http://127.0.0.1:8000/polls/).

---

### Modèles (`polls/models.py`)

Deux modèles Django suivant le tutoriel officiel :

#### `Question`

| Champ | Type | Description |
|---|---|---|
| `question_text` | `CharField(200)` | Texte de la question |
| `pub_date` | `DateTimeField` | Date de publication |

Méthode métier :

```python
def was_published_recently(self):
    """Retourne True si la question a été publiée dans les dernières 24h."""
```

#### `Choice`

| Champ | Type | Description |
|---|---|---|
| `question` | `ForeignKey(Question)` | Question associée (CASCADE) |
| `choice_text` | `CharField(200)` | Texte du choix |
| `votes` | `IntegerField(default=0)` | Compteur de votes |

#### Appliquer les migrations

```bash
cd djangotutorial
python manage.py migrate
```

---

### Vues (`polls/views.py`)

| Vue | URL | Méthode | Description |
|---|---|---|---|
| `index` | `/polls/` | GET | Liste les 5 dernières questions publiées |
| `detail` | `/polls/<id>/` | GET | Détail d'une question et ses choix |
| `results` | `/polls/<id>/results/` | GET | Résultats (votes) d'une question |
| `vote` | `/polls/<id>/vote/` | POST | Enregistre un vote (`choice=<id>`) |

Les vues futures non publiées sont automatiquement exclues de l'index.

---

### Tests unitaires (`polls/tests.py`)

26 tests répartis en 6 classes, documentés avec docstrings :

| Classe | Nb tests | Couverture |
|---|---|---|
| `QuestionModelTest` | 6 | `was_published_recently()`, `__str__`, création |
| `ChoiceModelTest` | 6 | `__str__`, votes, cascade, relations |
| `IndexViewTest` | 5 | état vide, questions passées/futures, limite 5 |
| `DetailViewTest` | 3 | 200 OK, 404, affichage des choix |
| `ResultsViewTest` | 3 | 200 OK, 404, compteurs de votes |
| `VoteViewTest` | 5 | vote valide, choix manquant/invalide, question inexistante |

#### Lancer les tests

```bash
cd djangotutorial
python manage.py test polls --verbosity=2
```

#### Lancer les tests avec coverage

```bash
cd djangotutorial
coverage run manage.py test polls
coverage report        # affichage terminal
coverage xml           # génère coverage.xml pour SonarQube
```

---

### Linter (`ruff`)

[ruff](https://docs.astral.sh/ruff/) est configuré dans `pyproject.toml`. Il remplace flake8, isort et pyupgrade en un seul outil.

Règles actives : `E`, `W` (pycodestyle), `F` (pyflakes), `I` (isort), `N` (pep8-naming), `UP` (pyupgrade).

```bash
cd djangotutorial
ruff check .          # analyse statique
ruff format --check . # vérification du formatage
ruff format .         # correction automatique du formatage
```

---

### CI/CD (`.github/workflows/ci.yml`)

Le pipeline s'exécute sur les branches `main`, `dev`, et `*devops*`.

```
push / pull_request
        │
        ├── build      (placeholder, extensible)
        ├── test       ──── Python 3.12 + pip + migrate + coverage
        └── lint       ──── ruff check + ruff format --check
                │
                └── sonar_analysis  ──── SonarQube (prod: main / preprod: autres)
                        │
                        ├── notify_failure  ──── Discord webhook (gif aléatoire)
                        └── notify_success  ──── Discord webhook (gif aléatoire)
```

#### Job `test`

1. Checkout du code
2. Setup Python 3.12 (cache pip)
3. `pip install -r requirements.txt`
4. `python manage.py migrate`
5. `coverage run manage.py test polls`
6. `coverage xml` → upload de `coverage.xml` en artefact

#### Job `lint`

1. Checkout du code
2. Setup Python 3.12 (cache pip)
3. `pip install -r requirements.txt`
4. `ruff check .`
5. `ruff format --check .`

#### Job `sonar_analysis`

- Déclenché uniquement si `test` et `lint` passent
- Télécharge l'artefact `coverage.xml`
- Scan SonarQube : token `SONAR_PROD_TOKEN` sur `main`, `SONAR_PREPROD_TOKEN` sur les autres branches

#### Secrets GitHub requis

À configurer dans **Settings → Secrets and variables → Actions** :

| Secret | Description |
|---|---|
| `SONAR_HOST_URL` | URL SonarQube : `https://sonarqube.ton-domaine.com` ou `https://sonarcloud.io` |
| `SONAR_PROD_TOKEN` | Token SonarQube pour la branche `main` *(My Account → Security → Generate Token)* |
| `SONAR_PREPROD_TOKEN` | Token SonarQube pour les autres branches (peut être le même token) |
| `DISCORD_LOG` | URL webhook Discord *(Paramètres canal → Intégrations → Webhooks)* |

> **SonarCloud** (gratuit) : utiliser `https://sonarcloud.io` comme `SONAR_HOST_URL` et ajouter `sonar.organization=ton-org-github` dans `sonar-project.properties`.

---

### Historique

| Date | Action |
|------|---------|
| 21/05/2026 | Création de la branche `django`, initialisation du projet, application des migrations initiales, création de l'app `polls` avec une première vue et son routage |
| 25/05/2026 | Ajout des modèles `Question` et `Choice`, 4 vues complètes, 26 tests unitaires documentés, linter ruff, migration initiale, CI adapté Python/Django avec coverage, analyse SonarQube |


creation d'une api express

mkdir labapi
cd labapi

npm init

npm install express

ajout de snodes modules dans le gitignore
