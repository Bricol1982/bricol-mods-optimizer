# 🎯 SWGOH Mod Targets - Système de Gestion des Presets

Système de gestion versionné des configurations de modding pour différents modes de jeu dans Star Wars: Galaxy of Heroes.

## 📋 Table des Matières

- [Vue d'ensemble](#vue-densemble)
- [Structure des Dossiers](#structure-des-dossiers)
- [Installation](#installation)
- [Utilisation](#utilisation)
- [Stratégies par Mode](#stratégies-par-mode)
- [Format de Versioning](#format-de-versioning)
- [Exemples](#exemples)
- [Workflow Recommandé](#workflow-recommandé)

---

## 🎯 Vue d'ensemble

Ce système permet de :

- ✅ **Générer automatiquement** des configurations optimales par mode de jeu
- ✅ **Versionner** chaque configuration avec date et numéro de version
- ✅ **Appliquer rapidement** des presets selon l'activité en cours
- ✅ **Suivre l'historique** des configurations utilisées
- ✅ **Partager** des configurations optimisées

### Fichier de Base

Le fichier [`modsOptimizer-2025-12-10.json.sample`](modsOptimizer-2025-12-10.json.sample) contient votre configuration complète de base avec :
- **291 personnages** avec leurs stats
- Mods équipés actuels
- Configurations d'optimisation existantes

**⚠️ Important :**
- Ce fichier `.sample` est la source de vérité. Toutes les configurations générées partent de cette base.
- **Format critique :** Le fichier est au format JSON minifié (une seule ligne, pas d'indentation). Tous les presets générés utilisent automatiquement ce même format pour garantir la compatibilité avec l'outil d'optimisation.

---

## 📁 Structure des Dossiers

```
SWGOH_Mod_Targets/
├── preset_manager.py                   # Script de gestion des presets
├── README.md                           # Cette documentation
├── modding-SWGOH.md                    # Guide des stratégies par mode
├── modsOptimizer-2025-12-10.json.sample  # Configuration de base
│
├── GAC_5v5/                            # Grand Arena 5v5
│   ├── 2025-12-10_v1.json
│   ├── 2025-12-10_v2.json
│   └── 2025-12-15_v1.json
│
├── GAC_3v3/                            # Grand Arena 3v3
├── RAID_NABOO/                         # Battle for Naboo
├── RAID_KRAYT/                         # Krayt Dragon
├── TB_ROTE/                            # Rise of the Empire TB
├── TB_DS/                              # Dark Side TB
├── TB_LS/                              # Light Side TB
├── ARENA/                              # Squad Arena
├── CONQUEST/                           # Conquest
├── JOURNEY/                            # Journey Guide
├── CHALLENGES/                         # Galactic Challenges
├── REVAMISSION/                        # Reva Mission
├── FASTEST/                            # Ultra-speed characters
├── TANKY/                              # Tank & Defenders
└── BENCH/                              # Unused roster
```

---

## 🚀 Installation

### Prérequis

- Python 3.7+
- Le fichier `.sample` dans le dossier `SWGOH_Mod_Targets/`

### Vérification

```bash
cd SWGOH_Mod_Targets
python3 preset_manager.py modes
```

---

## 💻 Utilisation

### Commandes Disponibles

#### 1. Lister les modes disponibles

```bash
python3 preset_manager.py modes
```

**Affiche :**
```
GAC_5v5
  Grand Arena Championship 5v5 - Maximum Speed Priority

RAID_NABOO
  Battle for Naboo Raid - Damage Focus, Reduced Speed

TANKY
  Tanks & Support Defenders - Maximum Survivability

... etc
```

---

#### 2. Générer un nouveau preset

```bash
python3 preset_manager.py generate <MODE> [--description "desc"] [--version "version"]
```

**Exemples :**

```bash
# Générer preset GAC avec version automatique (2025-12-10_v1)
python3 preset_manager.py generate GAC_5v5

# Avec description personnalisée
python3 preset_manager.py generate RAID_NABOO --description "Config pour Droideka team"

# Avec version personnalisée
python3 preset_manager.py generate FASTEST --version "2025-12-10_speed_meta"
```

**Sortie :**
```
Loading base sample data from modsOptimizer-2025-12-10.json.sample...
Applying GAC_5v5 strategy to all characters...
Saving preset to GAC_5v5/2025-12-10_v1.json...
✓ Preset generated successfully!
  Mode: GAC_5v5
  Version: 2025-12-10_v1
  File: GAC_5v5/2025-12-10_v1.json
  Strategy: Grand Arena Championship 5v5 - Maximum Speed Priority
```

---

#### 3. Lister les presets existants

```bash
# Tous les presets
python3 preset_manager.py list

# Presets d'un mode spécifique
python3 preset_manager.py list GAC_5v5
```

**Sortie :**
```
GAC_5v5:
================================================================================
  2025-12-10_v2
    Generated: 2025-12-10T15:30:00
    Description: Meta speed après patch
    Strategy: Grand Arena Championship 5v5 - Maximum Speed Priority

  2025-12-10_v1
    Generated: 2025-12-10T10:15:00
    Strategy: Grand Arena Championship 5v5 - Maximum Speed Priority
```

---

#### 4. Informations détaillées sur un preset

```bash
python3 preset_manager.py info <MODE> <VERSION>
```

**Exemple :**
```bash
python3 preset_manager.py info GAC_5v5 2025-12-10_v1
```

**Sortie :**
```
Preset Information:
================================================================================
Mode: GAC_5v5
Version: 2025-12-10_v1
File: GAC_5v5/2025-12-10_v1.json
File Size: 1,156,789 bytes
Characters: 291
Profiles: 1

Metadata:
  mode: GAC_5v5
  strategy: Grand Arena Championship 5v5 - Maximum Speed Priority
  generated_at: 2025-12-10T10:15:00
  generated_from: modsOptimizer-2025-12-10.json.sample
```

---

#### 5. Appliquer un preset

```bash
python3 preset_manager.py apply <MODE> <VERSION> [--output "path"]
```

**Exemples :**

```bash
# Copier vers le répertoire parent avec nom auto
python3 preset_manager.py apply GAC_5v5 2025-12-10_v1

# Copier vers un chemin spécifique
python3 preset_manager.py apply RAID_NABOO 2025-12-10_v1 --output ~/config-naboo.json
```

**Sortie :**
```
✓ Preset applied!
  From: GAC_5v5/2025-12-10_v1.json
  To: /home/bricol/Documents/GitHub/bricol-mods-optimizer/modsOptimizer-GAC_5v5-2025-12-10_v1.json
```

---

## 🎮 Stratégies par Mode

### Modes PvP (Focus Vitesse)

| Mode | Priorités Stats | Description |
|------|----------------|-------------|
| **GAC_5v5** | Speed 100, CritDmg 75, CritChance 50 | Vitesse maximale pour jouer en premier |
| **GAC_3v3** | Speed 100, CritDmg 75, CritChance 50 | Identique à 5v5 |
| **ARENA** | Speed 90, CritDmg 70, CritChance 50 | Légèrement plus souple |

### Modes PvE Raids (Focus Dégâts)

| Mode | Priorités Stats | Description |
|------|----------------|-------------|
| **RAID_NABOO** | CritDmg 100, Phys/Spec 75, Speed 25 | Dégâts maximaux, vitesse réduite |
| **RAID_KRAYT** | Potency 75, Phys/Spec 70, CritDmg 80 | Potency crucial pour debuffs |

### Modes TB (Focus Survie)

| Mode | Priorités Stats | Description |
|------|----------------|-------------|
| **TB_ROTE** | Health 80, Prot 80, Tenacity 60 | Survie maximum pour missions difficiles |
| **TB_DS/LS** | Health 60, Prot 60, Speed 70 | Balance survie/dégâts |

### Catégories Spéciales

| Mode | Priorités Stats | Description |
|------|----------------|-------------|
| **FASTEST** | Speed 100 uniquement | Openers absolus (Thrawn, C-3PO) |
| **TANKY** | Health 100, Prot 100, Armor 80 | Murs défensifs purs |
| **BENCH** | Tout à 20, pas d'upgrade | Minimum pour GP |

Pour plus de détails, voir [`modding-SWGOH.md`](modding-SWGOH.md).

---

## 📅 Format de Versioning

### Schéma : `YYYY-MM-DD_vN`

- **YYYY-MM-DD** : Date de création
- **vN** : Numéro de version incrémental pour cette date

### Exemples

```
2025-12-10_v1    # Première version du 10 décembre
2025-12-10_v2    # Deuxième version du 10 décembre
2025-12-15_v1    # Première version du 15 décembre
```

### Versions Personnalisées

Vous pouvez utiliser des noms personnalisés :

```bash
python3 preset_manager.py generate GAC_5v5 --version "christmas_meta"
python3 preset_manager.py generate RAID_NABOO --version "patch_8.5_optimal"
```

---

## 📝 Exemples d'Utilisation

### Exemple 1 : Préparation pour GAC

```bash
# Générer la config GAC
python3 preset_manager.py generate GAC_5v5 --description "Config semaine 15"

# Vérifier le preset
python3 preset_manager.py info GAC_5v5 2025-12-10_v1

# Appliquer (copier vers app)
python3 preset_manager.py apply GAC_5v5 2025-12-10_v1
```

### Exemple 2 : Optimisation Raid Naboo

```bash
# Générer config spécifique raid
python3 preset_manager.py generate RAID_NABOO --description "Team Droideka optimisée"

# Lister toutes les versions Naboo
python3 preset_manager.py list RAID_NABOO

# Appliquer la meilleure
python3 preset_manager.py apply RAID_NABOO 2025-12-10_v2
```

### Exemple 3 : Test de Différentes Stratégies

```bash
# Générer v1 avec settings par défaut
python3 preset_manager.py generate FASTEST

# Modifier manuellement le JSON généré pour tester variantes
# (éditer FASTEST/2025-12-10_v1.json)

# Générer v2 avec autre approche
python3 preset_manager.py generate FASTEST --description "Alternative : potency focus"

# Comparer les résultats in-game et garder la meilleure
```

---

## 🔄 Workflow Recommandé

### 1️⃣ Création Initiale des Presets

```bash
# Générer un preset pour chaque mode principal
python3 preset_manager.py generate GAC_5v5
python3 preset_manager.py generate RAID_NABOO
python3 preset_manager.py generate TB_ROTE
python3 preset_manager.py generate FASTEST
python3 preset_manager.py generate TANKY
```

### 2️⃣ Avant Chaque Activité

```bash
# Identifier le mode à venir (ex: GAC cette semaine)
python3 preset_manager.py list GAC_5v5

# Appliquer le preset le plus récent
python3 preset_manager.py apply GAC_5v5 2025-12-10_v1 --output ../active-config.json

# Charger dans l'app GrandIvory et optimiser
```

### 3️⃣ Après Changements Méta

```bash
# Créer une nouvelle version avec ajustements
python3 preset_manager.py generate GAC_5v5 --description "Après nerf Profundity"

# Cela créera automatiquement 2025-12-10_v2 (ou v3, v4, etc.)
```

### 4️⃣ Maintenance et Archivage

```bash
# Lister toutes les configs pour faire le ménage
python3 preset_manager.py list

# Supprimer manuellement les anciennes versions obsolètes
rm GAC_5v5/2025-11-01_v*.json

# Garder toujours au moins une version récente par mode
```

---

## 🔧 Personnalisation Avancée

### Modifier les Stratégies par Défaut

Éditez [`preset_manager.py`](preset_manager.py) section `MODE_STRATEGIES` :

```python
'GAC_5v5': {
    'description': 'Grand Arena Championship 5v5 - Maximum Speed Priority',
    'default_target': {
        'name': 'GAC Speed',
        'speed': 100,           # ← Ajuster ces valeurs
        'critChance': 50,
        'critDmg': 75,
        # ... etc
    }
}
```

### Ajouter un Nouveau Mode

1. Créer le dossier : `mkdir SWGOH_Mod_Targets/CUSTOM_MODE`
2. Ajouter l'entrée dans `MODE_STRATEGIES`
3. Générer le premier preset : `python3 preset_manager.py generate CUSTOM_MODE`

### Édition Manuelle Post-Génération

Après génération, vous pouvez éditer manuellement les JSON :

```bash
# Générer base
python3 preset_manager.py generate RAID_NABOO

# Éditer pour ajustements fins
nano RAID_NABOO/2025-12-10_v1.json

# Le preset reste versionné et utilisable
python3 preset_manager.py apply RAID_NABOO 2025-12-10_v1
```

---

## 🎯 Structure des Target Stats

Chaque personnage reçoit un `target` avec le format suivant :

```json
{
  "name": "GAC Speed",
  "speed": 100,
  "critChance": 50,
  "critDmg": 75,
  "potency": 25,
  "tenacity": 0,
  "physDmg": 40,
  "specDmg": 40,
  "health": 10,
  "protection": 10,
  "armor": 0,
  "resistance": 0,
  "accuracy": 0,
  "critAvoid": 0,
  "upgradeMods": true,
  "primaryStatRestrictions": {},
  "setRestrictions": {},
  "targetStats": [],
  "useOnlyFullSets": false
}
```

### Échelle des Poids

- **0** : Ignoré
- **1-25** : Priorité faible
- **26-50** : Priorité moyenne
- **51-75** : Priorité élevée
- **76-100** : Priorité maximale

---

## 🐛 Dépannage

### Problème : "Sample file not found"

**Solution :**
```bash
# Vérifier la présence du fichier
ls -lh modsOptimizer-2025-12-10.json.sample

# Le fichier doit être dans SWGOH_Mod_Targets/
```

### Problème : "Unknown mode"

**Solution :**
```bash
# Lister les modes disponibles
python3 preset_manager.py modes

# Utiliser exactement le nom affiché (sensible à la casse)
```

### Problème : Preset généré mais vide

**Solution :**
```bash
# Vérifier que le .sample contient des données
python3 -c "
import json
data = json.load(open('modsOptimizer-2025-12-10.json.sample'))
print(f'Profiles: {len(data.get(\"profiles\", []))}')
print(f'Characters: {len(data[\"profiles\"][0].get(\"characters\", {}))}')
"
```

---

## 📚 Ressources Additionnelles

- **Guide des stratégies :** [`modding-SWGOH.md`](modding-SWGOH.md)
- **Code source :** [`preset_manager.py`](preset_manager.py)
- **Configuration de base :** [`modsOptimizer-2025-12-10.json.sample`](modsOptimizer-2025-12-10.json.sample)

---

## 🤝 Contribution

Pour ajouter de nouvelles stratégies ou améliorer les existantes :

1. Testez in-game les configurations
2. Documentez les résultats
3. Modifiez `MODE_STRATEGIES` dans `preset_manager.py`
4. Partagez vos presets optimisés

---

## 📄 Licence

Ce système fait partie du projet `bricol-mods-optimizer`, fork de [mods-optimizer by grandivory](https://github.com/grandivory/mods-optimizer).

---

**Bon modding !** 🚀
