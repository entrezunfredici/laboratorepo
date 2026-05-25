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
└── mysite/
    ├── settings.py
    ├── urls.py
    ├── asgi.py
    └── wsgi.py
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

### Historique

| Date | Action |
|------|---------|
| 21/05/2026 | Création de la branche `django`, initialisation du projet, application des migrations initiales, création de l'app `polls` avec une première vue et son routage |

