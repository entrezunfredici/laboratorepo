# AGENT.md — Directives pour agents IA

> Fichier universel. À placer à la racine du projet ou dans `.agent/`.  
> Complété par `CONVENTIONS.md` (spécifique au projet) et `DECISIONS.md` (rempli au fil du projet).

---

## 1. Comportement général

### Avant de coder

- Lis `CONVENTIONS.md` et `ARCHITECTURE.md` avant toute implémentation.
- Si une information manque pour réaliser la tâche, **pose une question avant de coder** — ne fais pas d'hypothèse silencieuse.
- Si la tâche implique de modifier une interface publique (fonction exportée, endpoint, schéma), **signale-le explicitement** et attends validation avant de continuer.

### En début de session

Avant toute chose, lis dans cet ordre :
1. `AGENT.md` — ce fichier
2. `CONVENTIONS.md` — stack et règles du projet
3. `CHANGELOG_AGENT.md` — état actuel du code, ce qui a déjà été fait
4. `ARCHITECTURE.md` — structure des modules
5. Le ticket courant

`CHANGELOG_AGENT.md` est ta mémoire de session — il te dit où en est le projet sans que tu aies à inférer depuis le code.

---

### Tickets en séquence — audit obligatoire avant implémentation

Les tickets sont livrés dans un ordre qui respecte les dépendances. Les tickets précédents ont déjà été implémentés. Avant de coder, tu dois systématiquement :

**1. Identifier les fichiers concernés**
Liste les fichiers existants directement liés au ticket (modèles, services, permissions, tests...).

**2. Auditer l'état réel du code**
Pour chaque dépendance listée dans le ticket, vérifie ce qui est déjà implémenté :
- Ce qui existe et que tu dois utiliser tel quel
- Ce qui existe mais doit être étendu
- Ce qui n'existe pas encore et est dans ton périmètre

**3. Signaler les écarts**
Si l'état du code ne correspond pas à ce que le ticket suppose (dépendance manquante, interface différente, migration absente), **signale-le avant de coder** — ne comble pas silencieusement.

**4. Attends validation si un écart bloque**
Si une dépendance supposée présente est absente, pose la question. Ne l'implémente pas de ton propre chef sauf si c'est explicitement dans le périmètre du ticket.

> Résumé en une ligne : **lis le code existant avant d'écrire une ligne, adapte-toi à ce qui est là.**

### Pendant le codage

- Travaille **un module à la fois**, dans les contraintes d'architecture définies.
- Ne refactore pas du code hors du périmètre du ticket en cours.
- N'ajoute pas de dépendance externe sans la signaler et justifier le choix.
- Si tu détectes un problème dans un module adjacent, **signale-le dans un commentaire `TODO`** plutôt que de le corriger silencieusement.

### En cas d'ambiguïté

- Priorité : respecter l'architecture définie > respect des conventions > performance > concision du code.
- Si deux approches sont valides, choisis la plus simple et documente le choix dans `DECISIONS.md`.

---

## 2. Standards de code

### Documentation obligatoire

Toute fonction publique (exportée ou accessible depuis un autre module) doit avoir une docstring/JSDoc :

```
/**
 * [Description en une phrase]
 *
 * @param {Type} nom - Description
 * @returns {Type} Description
 * @throws {ErrorType} Quand / pourquoi
 */
```

### Commentaires de décision

Pour tout choix non-trivial (algorithme, structure de données, pattern), ajoute un commentaire inline :

```
// CHOIX: [approche retenue] plutôt que [alternative écartée]
// RAISON: [justification courte]
```

### Gestion d'erreurs

- Ne catch pas silencieusement (`catch(e) {}`).
- Toute erreur doit être soit propagée, soit loguée avec contexte.
- Les erreurs attendues (validation, not found) sont distinguées des erreurs système.

### Nommage

- Suit les conventions définies dans `CONVENTIONS.md`.
- En l'absence de convention explicite : nommage descriptif > nommage court.

---

## 3. Tests

- Chaque module livré doit inclure ses tests unitaires.
- Les tests couvrent : le cas nominal, les cas limites, les erreurs attendues.
- Ne pas mocker ce qui peut être testé directement.
- Format des noms de test : `[fonction] - [contexte] - [résultat attendu]`

```
✓ parseDate - date valide ISO - retourne un objet Date
✓ parseDate - chaîne vide - lève une InvalidDateError
✓ parseDate - format non supporté - retourne null
```

---

## 4. Ce que l'agent NE doit PAS faire

| Interdit | Raison |
|----------|--------|
| Modifier les interfaces publiques sans validation | Casse les modules dépendants |
| Refactorer hors du périmètre du ticket | Introduit du risque non planifié |
| Ajouter une dépendance externe sans signalement | Gestion des versions et sécurité |
| Supprimer des tests existants | Même s'ils échouent — les signaler à la place |
| Changer la structure de dossiers | Sauf si c'est explicitement dans le ticket |
| Laisser du code commenté | Utiliser `TODO:` avec contexte ou supprimer |

---

## 5. Livraison d'un ticket

Checklist avant de considérer un ticket terminé :

- [ ] Code dans les contraintes d'architecture
- [ ] Docstrings/JSDoc sur les fonctions publiques
- [ ] Commentaires de décision sur les choix non-triviaux
- [ ] Tests unitaires (nominal + limites + erreurs)
- [ ] Linter passe sans erreur
- [ ] `DECISIONS.md` mis à jour si un choix structurant a été fait
- [ ] `README.md` mis à jour si un comportement public change
- [ ] `CHANGELOG_AGENT.md` mis à jour — fichiers créés/modifiés, ce qui est utilisable, hypothèses posées, dette éventuelle

---

## 6. Format de rapport de fin de ticket

Après chaque ticket, fournis un résumé court :

```
## Ticket [ID] — [Titre]

**Ce qui a été fait** : ...
**Choix techniques** : ...
**Ce qui n'est PAS couvert** : ...
**Points d'attention** : ... (dette, risques, dépendances fragiles)
```
