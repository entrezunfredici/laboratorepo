# CLAUDE.md — Instructions pour Claude Code

Ce fichier est lu automatiquement par Claude Code à chaque session.  
Il délègue les règles de comportement aux fichiers `.agents/`.

---

## Lecture obligatoire en début de session

Lis ces fichiers dans cet ordre avant toute action :

1. `.agents/AGENT.md` — comportement général, règles de codage, checklist de livraison
2. `.agents/CONVENTIONS.md` — stack technique et conventions spécifiques au projet
3. `.agents/CHANGELOG_AGENT.md` — état actuel du code (où en est le projet)
4. `.agents/DECISIONS.md` — décisions techniques déjà prises (ne pas les remettre en question sans raison)

---

## Règles non-négociables

- **Après chaque modification de code** : mettre à jour `CHANGELOG_AGENT.md` et `README.md`.
- **Toute fonction publique** doit avoir une JSDoc/docstring.
- **Ne pas modifier les interfaces publiques** sans signaler et attendre validation.
- **Ne pas ajouter de dépendance** sans la justifier.

> Le détail complet de ces règles est dans `.agents/AGENT.md`.
