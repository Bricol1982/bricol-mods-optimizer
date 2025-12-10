# 🔧 Notes Techniques - SWGOH Mod Targets

Documentation technique sur les contraintes d'implémentation et de format.

---

## ⚠️ FORMAT JSON CRITIQUE

### Contrainte Absolue

**Les fichiers JSON générés DOIVENT être au format minifié identique au fichier `.sample`**

### Raison

L'outil d'optimisation (GrandIvory Mods Optimizer) s'attend à un format JSON spécifique pour l'import. Tout écart de formatage peut causer des erreurs d'import ou de parsing.

### Format Requis

```
Format: JSON minifié (compact)
- Pas d'indentation
- Pas d'espaces superflus après les virgules/deux-points
- Une seule ligne (pas de retours à la ligne)
- Pas de newline final
- Séparateurs: ',' et ':' (sans espaces)
```

### Exemple Correct

```json
{"profiles":[{"allyCode":"123456","playerName":"User","characters":{"CHAR1":{"baseID":"CHAR1","playerValues":{...},"optimizerSettings":{"targets":[...]}}}}]}
```

### Exemple INCORRECT

```json
{
  "profiles": [
    {
      "allyCode": "123456",
      "playerName": "User"
    }
  ]
}
```

---

## 🔍 Vérification du Format

### Commande de Vérification

```bash
# Vérifier qu'un preset est au bon format
python3 -c "
import sys
with open('MODE/VERSION.json', 'r') as f:
    content = f.read()
    lines = content.split('\n')
    if len(lines) == 1:
        print('✓ Format correct (minifié)')
    else:
        print(f'✗ Format incorrect ({len(lines)} lignes)')
        sys.exit(1)
"
```

### Test de Compatibilité

```bash
# Charger le JSON pour vérifier sa validité
python3 -c "
import json
with open('MODE/VERSION.json', 'r') as f:
    data = json.load(f)
print('✓ JSON valide')
print(f'Profiles: {len(data.get(\"profiles\", []))}')
"
```

---

## 💻 Implémentation dans preset_manager.py

### Code Utilisé

```python
with open(output_file, 'w', encoding='utf-8') as f:
    # Use compact format (no indent) to match the .sample file format
    # This ensures compatibility with the optimizer tool
    json.dump(data, f, ensure_ascii=False, separators=(',', ':'))
```

### Paramètres Critiques

| Paramètre | Valeur | Raison |
|-----------|--------|--------|
| `indent` | **NON utilisé** | Pas d'indentation = minifié |
| `ensure_ascii` | `False` | Support caractères Unicode |
| `separators` | `(',', ':')` | Format compact sans espaces |

### ⚠️ NE PAS MODIFIER

**Ne jamais changer ces paramètres sans tester l'import dans l'outil !**

---

## 🧪 Tests de Régression

### Avant Toute Modification

Si vous devez modifier `preset_manager.py`, testez :

1. **Génération**
   ```bash
   python3 preset_manager.py generate GAC_5v5 --description "Test"
   ```

2. **Vérification format**
   ```bash
   wc -l GAC_5v5/YYYY-MM-DD_vN.json
   # Doit afficher: 0 (ou 1 selon si newline finale)
   ```

3. **Validation JSON**
   ```bash
   python3 -c "import json; json.load(open('GAC_5v5/YYYY-MM-DD_vN.json'))"
   ```

4. **Test d'import**
   - Charger le fichier dans GrandIvory Mods Optimizer
   - Vérifier que tous les personnages sont présents
   - Vérifier que les targets sont correctes

---

## 📊 Comparaison Format

### Sample vs Preset Généré

```python
# Script de comparaison
import json

with open('modsOptimizer-2025-12-10.json.sample', 'r') as f:
    sample = f.read()

with open('GAC_5v5/2025-12-10_v1.json', 'r') as f:
    preset = f.read()

# Comparer les formats
print(f"Sample: {len(sample.split(chr(10)))} lignes")
print(f"Preset: {len(preset.split(chr(10)))} lignes")

# Comparer les structures
sample_data = json.loads(sample)
preset_data = json.loads(preset)

print(f"Sample keys: {list(sample_data.keys())}")
print(f"Preset keys: {list(preset_data.keys())}")
```

---

## 🐛 Problèmes Connus

### Problème 1: Indentation Ajoutée

**Symptôme:** Le fichier généré a plusieurs lignes avec indentation

**Cause:** Utilisation de `json.dump(..., indent=2)`

**Solution:** Retirer le paramètre `indent`

### Problème 2: Espaces Superflus

**Symptôme:** Le fichier contient `", "` ou `": "` au lieu de `","` et `":"`

**Cause:** `separators` par défaut de json.dump

**Solution:** Utiliser `separators=(',', ':')`

### Problème 3: Newline Finale

**Symptôme:** Le fichier se termine par un saut de ligne

**Cause:** Éditeur ajoute automatiquement

**Solution:** Le laisser tel quel (n'affecte pas l'import)

---

## 📦 Structure JSON Complète

### Clés Racine Requises

```json
{
  "profiles": [...],           // REQUIS - Liste des profils joueurs
  "gameSettings": {...},       // REQUIS - Settings du jeu
  "lastRuns": [...],          // REQUIS - Historique optimisations
  "characterTemplates": {...}, // REQUIS - Templates personnages
  "version": "...",           // REQUIS - Version du format
  "allyCode": "...",          // REQUIS - Ally code principal
  "metadata": {...}           // OPTIONNEL - Métadonnées preset
}
```

### Structure Profile

```json
{
  "allyCode": "123456789",
  "playerName": "Username",
  "characters": {
    "CHARACTERID": {
      "baseID": "CHARACTERID",
      "playerValues": {
        "level": 85,
        "stars": 7,
        "gearLevel": 13,
        // ... autres stats
      },
      "optimizerSettings": {
        "targets": [
          {
            "name": "Target Name",
            "speed": 100,
            "critDmg": 75,
            // ... toutes les stats
          }
        ],
        "minimumModDots": 5,
        "sliceMods": true,
        "isLocked": false
      }
    }
  },
  "mods": [...],
  "selectedCharacters": [...],
  // ... autres champs
}
```

---

## 🔐 Intégrité des Données

### Champs à Ne Jamais Modifier

Dans `playerValues`:
- `level`
- `stars`
- `gearLevel`
- `baseStats`
- `equippedStats`

Ces valeurs proviennent de l'API du jeu et ne doivent jamais être modifiées manuellement.

### Champs Modifiables

Dans `optimizerSettings.targets`:
- **Tous les poids de stats** (speed, critDmg, etc.)
- `name` (nom de la cible)
- `minimumModDots`
- `sliceMods`
- `primaryStatRestrictions`
- `setRestrictions`
- `targetStats`
- `useOnlyFullSets`

---

## 🔄 Historique des Changements

### Version 1.0 (2025-12-10)

**Changement:** Correction du format JSON

**Avant:**
```python
json.dump(data, f, indent=2, ensure_ascii=False)
```

**Après:**
```python
json.dump(data, f, ensure_ascii=False, separators=(',', ':'))
```

**Raison:** Compatibilité avec l'outil d'import

**Impact:** Tous les presets existants ont été régénérés

---

## 📚 Références

### Documentation JSON Python
- https://docs.python.org/3/library/json.html#json.dump

### Format Compact
- `separators=(',', ':')` = format le plus compact
- `indent=None` (défaut) = pas d'indentation
- `ensure_ascii=False` = support Unicode

### Taille des Fichiers

| Format | Taille Typique |
|--------|----------------|
| Minifié | ~980 KB |
| Indenté (2 spaces) | ~1.2 MB |
| Indenté (4 spaces) | ~1.4 MB |

**Gain:** ~20-30% de réduction avec format minifié

---

## ✅ Checklist Développeur

Avant de modifier le système:

- [ ] Lire cette documentation
- [ ] Comprendre les contraintes de format
- [ ] Tester sur fichier sample
- [ ] Vérifier compatibilité import
- [ ] Documenter tout changement
- [ ] Régénérer presets si nécessaire

---

**Dernière mise à jour:** 2025-12-10
**Version:** 1.0
**Auteur:** Système de gestion des presets SWGOH
