# 🚀 Quick Start - SWGOH Mod Targets

Guide de démarrage rapide pour utiliser le système de presets versionnés.

## ⚡ Commandes Essentielles

### 1. Voir les modes disponibles
```bash
cd SWGOH_Mod_Targets
python3 preset_manager.py modes
```

### 2. Générer un preset
```bash
# Exemple pour GAC
python3 preset_manager.py generate GAC_5v5 --description "Ma config GAC"

# Exemple pour Raid Naboo
python3 preset_manager.py generate RAID_NABOO --description "Config raid de cette semaine"
```

### 3. Lister les presets existants
```bash
# Tous les presets
python3 preset_manager.py list

# Un mode spécifique
python3 preset_manager.py list GAC_5v5
```

### 4. Voir les détails d'un preset
```bash
python3 preset_manager.py info GAC_5v5 2025-12-10_v1
```

### 5. Appliquer un preset
```bash
# Copie vers le répertoire parent
python3 preset_manager.py apply GAC_5v5 2025-12-10_v1

# Ou vers un chemin spécifique
python3 preset_manager.py apply GAC_5v5 2025-12-10_v1 --output ~/mon-config.json
```

---

## 📋 Modes Principaux

| Mode | Quand l'utiliser | Priorité |
|------|------------------|----------|
| `GAC_5v5` | Grand Arena 5v5 | Speed 100 |
| `GAC_3v3` | Grand Arena 3v3 | Speed 100 |
| `RAID_NABOO` | Raid Naboo | Damage + Low Speed |
| `RAID_KRAYT` | Raid Krayt | Potency + Offense |
| `TB_ROTE` | TB Rise Empire | Survivability |
| `FASTEST` | Openers (Thrawn, 3PO) | Speed 100 only |
| `TANKY` | Tanks purs | Health/Prot 100 |
| `BENCH` | GP padding | Minimal |

---

## 🎯 Workflow Typique

### Scénario : Préparation GAC

```bash
# 1. Générer le preset GAC
python3 preset_manager.py generate GAC_5v5 --description "GAC semaine 15"

# 2. Vérifier le preset
python3 preset_manager.py info GAC_5v5 2025-12-10_v1

# 3. Appliquer le preset
python3 preset_manager.py apply GAC_5v5 2025-12-10_v1

# 4. Charger le fichier généré dans GrandIvory/Optimizer

# 5. Optimiser et appliquer les mods in-game
```

---

## 🔄 Versioning Automatique

Le système crée automatiquement des versions par date :

```
2025-12-10_v1  ← Première version du 10 décembre
2025-12-10_v2  ← Deuxième version (même jour)
2025-12-15_v1  ← Nouvelle date = nouveau compteur
```

**Pas besoin de gérer les numéros manuellement !**

---

## 📝 Exemples Complets

### Exemple 1 : Tous les presets principaux
```bash
python3 preset_manager.py generate GAC_5v5 --description "Config standard GAC"
python3 preset_manager.py generate RAID_NABOO --description "Config raid Naboo"
python3 preset_manager.py generate TB_ROTE --description "Config ROTE TB"
python3 preset_manager.py generate FASTEST --description "Config openers"
```

### Exemple 2 : Variantes pour tests
```bash
# Version 1 : Focus speed pur
python3 preset_manager.py generate GAC_5v5 --description "Speed focus v1"

# Modifier manuellement le JSON pour tester autre chose
nano GAC_5v5/2025-12-10_v1.json

# Version 2 : Alternative
python3 preset_manager.py generate GAC_5v5 --description "Speed + potency v2"

# Comparer in-game et garder la meilleure
```

---

## 🛠️ Résolution de Problèmes

### Le fichier .sample n'existe pas
```bash
# Vérifier présence
ls -lh modsOptimizer-2025-12-10.json.sample

# Il doit être dans le dossier SWGOH_Mod_Targets/
```

### Erreur "Unknown mode"
```bash
# Lister les modes valides
python3 preset_manager.py modes

# Utiliser le nom exact (sensible à la casse)
```

### Preset généré mais ne s'applique pas
```bash
# Vérifier le format JSON
python3 -m json.tool GAC_5v5/2025-12-10_v1.json > /dev/null

# Si erreur JSON : régénérer
python3 preset_manager.py generate GAC_5v5
```

---

## 📚 Documentation Complète

Pour plus de détails, consultez :

- [README.md](README.md) - Documentation complète
- [modding-SWGOH.md](modding-SWGOH.md) - Guide des stratégies
- [preset_manager.py](preset_manager.py) - Code source

---

## 💡 Tips

1. **Générez un preset avant chaque activité importante** (GAC, raid, TB)
2. **Utilisez des descriptions claires** pour retrouver facilement vos configs
3. **Gardez les anciennes versions** en cas de besoin de revenir en arrière
4. **Testez plusieurs variantes** pour trouver ce qui fonctionne le mieux
5. **Partagez vos presets** avec votre guilde pour optimisation collective

---

**Bon modding !** 🎮
