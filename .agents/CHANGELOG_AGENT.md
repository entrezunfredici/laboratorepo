# CHANGELOG_AGENT.md — Journal d'état du projet

> Mis à jour par l'agent IA après chaque ticket terminé.  
> **But** : permettre à un humain ou un autre agent de reprendre le travail sans contexte de session.  
> Ne remplace pas `DECISIONS.md` (pourquoi) ni le README (usage) — répond à la question **"où en est le code ?"**

---

## Comment lire ce fichier

- Lis les entrées **du bas vers le haut** — la plus récente est en bas.
- Chaque entrée = un ticket terminé.
- La section **"État global"** en haut est mise à jour à chaque entrée et reflète toujours le présent.

---

## État global du projet

> Mis à jour après chaque ticket. Reflète l'état actuel.

| Module                        | État   | Dernière modif     |
| ----------------------------- | ------ | ------------------ |
| `polls/models.py`             | Stable | Phase 2 — 25/05/26 |
| `polls/views.py`              | Stable | Phase 2 — 25/05/26 |
| `polls/urls.py`               | Stable | Phase 2 — 25/05/26 |
| `polls/admin.py`              | Stable | Phase 2 — 25/05/26 |
| `polls/tests.py`              | Stable | Phase 2 — 25/05/26 |
| `polls/migrations/`           | Stable | Phase 2 — 25/05/26 |
| `mysite/settings.py`          | Stable | Phase 1 — 21/05/26 |
| `mysite/urls.py`              | Stable | Phase 2 — 25/05/26 |
| `.github/workflows/ci.yml`    | Stable | Phase 2 — 25/05/26 |

**Modules implémentés et stables :**
- `polls` — app Django complète : modèles, vues, URLs, admin, 26 tests, migration initiale
- `mysite` — projet Django configuré, routeur racine branché sur `polls/`
- CI/CD — pipeline GitHub Actions : tests (coverage), lint (ruff), SonarQube, Discord

**Modules partiellement implémentés :**
- Vues `polls` — retournent du texte brut (`HttpResponse`), pas encore de templates HTML

**Ce qui n'existe pas encore :**
- Templates HTML (étape 3+ du tutoriel Django officiel)
- Interface admin personnalisée (au-delà de l'enregistrement basique)
- Authentification / permissions utilisateurs

---

## Entrées

> Format à respecter pour chaque entrée :

```markdown
### [Ticket ID] — [Titre] — [Date]

**Fichiers créés :**
- `chemin/fichier.py` — description courte de ce qu'il contient

**Fichiers modifiés :**
- `chemin/fichier.py` — ce qui a changé et pourquoi

**Ce qui est utilisable par les tickets suivants :**
- `NomClasse` dans `module.py` — ce qu'elle expose
- `nom_fonction()` dans `utils.py` — signature + comportement attendu

**Hypothèses posées :**
- (ce que l'agent a supposé faute d'info explicite)

**Dette / points d'attention :**
- (ce qui est fragile, incomplet, ou à surveiller)
```

---

<!-- Les entrées réelles commencent ici, ajoutées par l'agent au fil du projet -->

---

### Phase 1 — Initialisation du projet Django — 2026-05-21

**Fichiers créés :**
- `djangotutorial/manage.py` — point d'entrée CLI Django
- `djangotutorial/mysite/settings.py` — configuration du projet (SQLite, apps installées)
- `djangotutorial/mysite/urls.py` — routeur racine (admin uniquement à ce stade)
- `djangotutorial/mysite/asgi.py`, `wsgi.py` — points d'entrée serveur
- `djangotutorial/polls/__init__.py`, `apps.py` — squelette de l'app polls
- `djangotutorial/polls/views.py` — vue `index` minimale (HttpResponse texte brut)
- `djangotutorial/polls/urls.py` — routeur polls avec route `index`

**Fichiers modifiés :**
- `djangotutorial/mysite/urls.py` — ajout de `include("polls.urls")` sur `/polls/`

**Ce qui est utilisable par les tickets suivants :**
- Projet Django initialisé et serveur de développement fonctionnel sur `http://127.0.0.1:8000/`
- App `polls` créée et branchée dans `INSTALLED_APPS` et `urls.py`
- Vue `index` accessible sur `/polls/`

**Hypothèses posées :**
- Base de données SQLite par défaut (fichier `db.sqlite3`) — choix du tutoriel officiel

**Dette / points d'attention :**
- Aucune migration appliquée à ce stade (tables admin/auth pas créées)

---

### Phase 2 — Modèles, vues complètes, tests, linter, CI — 2026-05-25

**Fichiers créés :**
- `djangotutorial/polls/models.py` — modèles `Question` et `Choice` avec `was_published_recently()`
- `djangotutorial/polls/migrations/0001_initial.py` — migration initiale (tables `polls_question` et `polls_choice`)
- `djangotutorial/polls/tests.py` — 26 tests en 6 classes (`QuestionModelTest`, `ChoiceModelTest`, `IndexViewTest`, `DetailViewTest`, `ResultsViewTest`, `VoteViewTest`)
- `djangotutorial/requirements.txt` — Django, ruff, coverage
- `djangotutorial/pyproject.toml` — config ruff (E/W/F/I/N/UP, 88 chars, Python 3.12) + coverage
- `.github/workflows/ci.yml` — pipeline : build / test / lint / sonar_analysis / notify

**Fichiers modifiés :**
- `djangotutorial/polls/views.py` — 4 vues complètes : `index`, `detail`, `results`, `vote` (HttpResponse, gestion 404/400)
- `djangotutorial/polls/urls.py` — 4 routes nommées sous `app_name = "polls"`
- `djangotutorial/mysite/urls.py` — déjà branché en Phase 1
- `djangotutorial/polls/admin.py` — enregistrement de `Question` et `Choice`

**Ce qui est utilisable par les tickets suivants :**
- `Question` dans `polls/models.py` — `question_text`, `pub_date`, `was_published_recently()`, `__str__`
- `Choice` dans `polls/models.py` — `question (FK)`, `choice_text`, `votes`, `__str__`
- `create_question(text, days)` dans `tests.py` — helper de fixture (offset jours depuis maintenant)
- `add_choice(question, text, votes=0)` dans `tests.py` — helper de fixture
- URLs nommées : `polls:index`, `polls:detail`, `polls:results`, `polls:vote` (utilisables avec `reverse()`)
- CI complète opérationnelle (tests + lint + SonarQube + Discord)

**Hypothèses posées :**
- Les vues retournent du texte brut (`HttpResponse`) sans templates — étape intermédiaire du tutoriel
- `vote` incrémente directement `choice.votes` (pas de protection contre les race conditions — scope tutoriel)
- CI déclenche SonarQube sur toutes les branches (prod token sur `main`, préprod sur les autres)

**Dette / points d'attention :**
- Incrémentation non-atomique des votes (`choice.votes += 1`) : susceptible aux race conditions sous charge — à corriger avec `F()` expression si le projet évolue
- Les vues n'utilisent pas `get_object_or_404()` (Django shortcut) — choix intentionnel pour la lisibilité à ce stade
- Pas de templates HTML : les vues retournent du texte brut, incompatible avec une interface utilisateur réelle
