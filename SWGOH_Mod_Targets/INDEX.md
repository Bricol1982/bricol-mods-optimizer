# 📑 Index - Système SWGOH Mod Targets

Documentation complète du système de gestion des presets versionnés.

## 🗂️ Documentation Disponible

| Fichier | Description | Quand le lire |
|---------|-------------|---------------|
| **[INDEX.md](INDEX.md)** | Ce fichier - Vue d'ensemble | En premier |
| **[QUICK_START.md](QUICK_START.md)** | Guide démarrage rapide | Pour commencer rapidement |
| **[README.md](README.md)** | Documentation complète | Pour comprendre en détail |
| **[STRATEGIES.md](STRATEGIES.md)** | Comparatif des stratégies | Pour choisir le bon mode |
| **[modding-SWGOH.md](modding-SWGOH.md)** | Contexte des modes de jeu | Pour comprendre le contexte |
| **[TECHNICAL_NOTES.md](TECHNICAL_NOTES.md)** | Notes techniques critiques | Pour développeurs/modifications |

---

## 🎯 Objectif du Système

**Problème résolu :** Gérer facilement plusieurs configurations de modding pour différents modes de jeu dans SWGOH.

**Avant :**
- ❌ Reconfiguration manuelle fastidieuse
- ❌ Perte de temps à chaque changement de mode
- ❌ Pas d'historique des configurations
- ❌ Difficile de revenir en arrière

**Après :**
- ✅ Génération automatique de presets
- ✅ Versioning par date
- ✅ Application en 1 commande
- ✅ Historique complet
- ✅ Partage facile avec la guilde

---

## 🚀 Démarrage Rapide (3 étapes)

### 1. Générer un preset
```bash
cd SWGOH_Mod_Targets
python3 preset_manager.py generate GAC_5v5 --description "Ma config"
```

### 2. Lister les presets
```bash
python3 preset_manager.py list
```

### 3. Appliquer un preset
```bash
python3 preset_manager.py apply GAC_5v5 2025-12-10_v1
```

**→ Voir [QUICK_START.md](QUICK_START.md) pour plus de détails**

---

## 📊 Système de Fichiers

### Structure
```
SWGOH_Mod_Targets/
├── 📄 Documentation
│   ├── INDEX.md              ← Vous êtes ici
│   ├── README.md             ← Doc complète
│   ├── QUICK_START.md        ← Guide rapide
│   ├── STRATEGIES.md         ← Comparatif stratégies
│   └── modding-SWGOH.md      ← Contexte modes
│
├── 🔧 Outils
│   └── preset_manager.py     ← Script principal
│
├── 📦 Base de Données
│   └── modsOptimizer-2025-12-10.json.sample  ← Configuration de base
│
└── 📁 Presets par Mode (16 dossiers)
    ├── GAC_5v5/              ← Grand Arena 5v5
    ├── GAC_3v3/              ← Grand Arena 3v3
    ├── RAID_NABOO/           ← Raid Naboo
    ├── RAID_KRAYT/           ← Raid Krayt
    ├── TB_ROTE/              ← TB Rise Empire
    ├── TB_DS/                ← TB Dark Side
    ├── TB_LS/                ← TB Light Side
    ├── ARENA/                ← Squad Arena
    ├── CONQUEST/             ← Conquest
    ├── JOURNEY/              ← Journey Guide
    ├── CHALLENGES/           ← Galactic Challenges
    ├── REVAMISSION/          ← Reva Mission
    ├── FASTEST/              ← Ultra-speed characters
    ├── TANKY/                ← Tanks & Defenders
    └── BENCH/                ← Unused roster
```

---

## 📋 Modes de Jeu Disponibles

### Modes PvP (3)
- **GAC_5v5** - Grand Arena 5v5 (Speed max)
- **GAC_3v3** - Grand Arena 3v3 (Speed max)
- **ARENA** - Squad Arena (Training)

### Modes Raids (2)
- **RAID_NABOO** - Battle for Naboo (Damage focus)
- **RAID_KRAYT** - Krayt Dragon (Potency focus)

### Modes TB (3)
- **TB_ROTE** - Rise of the Empire (Survival)
- **TB_DS** - Dark Side Geonosis (Wave clear)
- **TB_LS** - Light Side TB (Wave clear)

### Modes PvE Solo (4)
- **CONQUEST** - Conquest
- **JOURNEY** - Journey Guide
- **CHALLENGES** - Galactic Challenges
- **REVAMISSION** - Reva Mission

### Catégories Utilitaires (3)
- **FASTEST** - Openers ultra-rapides
- **TANKY** - Tanks purs
- **BENCH** - Roster non utilisé

**Total : 16 modes** → Voir [STRATEGIES.md](STRATEGIES.md) pour les détails

---

## 🔧 Commandes Principales

| Commande | Description | Exemple |
|----------|-------------|---------|
| `modes` | Lister modes disponibles | `python3 preset_manager.py modes` |
| `generate` | Générer nouveau preset | `python3 preset_manager.py generate GAC_5v5` |
| `list` | Lister presets existants | `python3 preset_manager.py list` |
| `info` | Info détaillée preset | `python3 preset_manager.py info GAC_5v5 2025-12-10_v1` |
| `apply` | Appliquer un preset | `python3 preset_manager.py apply GAC_5v5 2025-12-10_v1` |

**→ Voir [README.md](README.md) section "Utilisation" pour tous les détails**

---

## 📊 État Actuel du Système

### Presets Générés (Exemples)

✅ **GAC_5v5** - 1 preset
- `2025-12-10_v1.json` (1.6 MB) - Configuration initiale GAC

✅ **RAID_NABOO** - 1 preset
- `2025-12-10_v1.json` (1.6 MB) - Optimisation raid Naboo

✅ **FASTEST** - 1 preset
- `2025-12-10_v1.json` (1.6 MB) - Openers ultra-rapides

✅ **TANKY** - 1 preset
- `2025-12-10_v1.json` (1.6 MB) - Tanks et defenders

### Statistiques
- **Modes configurés :** 16
- **Presets générés :** 4 (exemples)
- **Personnages dans sample :** 291
- **Fichier base :** 1.0 MB
- **Total espace presets :** ~6.4 MB

---

## 🎮 Cas d'Usage Typiques

### Cas 1 : Préparation GAC
```bash
# Générer config GAC
python3 preset_manager.py generate GAC_5v5 --description "Semaine 15"

# Appliquer
python3 preset_manager.py apply GAC_5v5 2025-12-10_v1

# Charger dans GrandIvory et optimiser
```

### Cas 2 : Raid Naboo Incoming
```bash
# Générer config raid
python3 preset_manager.py generate RAID_NABOO --description "Team Droideka"

# Appliquer
python3 preset_manager.py apply RAID_NABOO 2025-12-10_v1

# Optimiser in-game
```

### Cas 3 : Configurer Openers
```bash
# Générer config ultra-speed
python3 preset_manager.py generate FASTEST --description "Thrawn, 3PO, Lando"

# Appliquer
python3 preset_manager.py apply FASTEST 2025-12-10_v1

# Cherry-pick uniquement Thrawn, C-3PO, Lando
```

**→ Voir [STRATEGIES.md](STRATEGIES.md) pour cas avancés**

---

## 📖 Parcours de Lecture Recommandé

### 🔰 Niveau Débutant
1. **[INDEX.md](INDEX.md)** ← Vous êtes ici
2. **[QUICK_START.md](QUICK_START.md)** ← Guide rapide
3. Tester : Générer votre premier preset
4. **[modding-SWGOH.md](modding-SWGOH.md)** ← Comprendre les modes

### 📚 Niveau Intermédiaire
1. **[README.md](README.md)** ← Doc complète
2. **[STRATEGIES.md](STRATEGIES.md)** ← Comparatif détaillé
3. Expérimenter : Générer plusieurs presets
4. Tester in-game et comparer

### 🎓 Niveau Avancé
1. **[preset_manager.py](preset_manager.py)** ← Code source
2. Modifier les stratégies dans `MODE_STRATEGIES`
3. Ajouter des modes personnalisés
4. Créer presets hybrides sur mesure

---

## 🔍 FAQ Rapide

### Comment démarrer ?
→ Lire [QUICK_START.md](QUICK_START.md) et générer un preset

### Quel mode utiliser pour GAC ?
→ `GAC_5v5` ou `GAC_3v3` selon le format actuel

### Comment revenir en arrière ?
→ Tous les presets sont versionnés, il suffit d'appliquer une version antérieure

### Puis-je modifier un preset après génération ?
→ Oui ! Éditez le JSON manuellement, il reste versionné

### Comment partager avec ma guilde ?
→ Copiez le fichier JSON du preset et partagez-le

### Le système marche avec HotUtils/C-3PO ?
→ Oui ! Les presets sont compatibles avec tous les outils d'import

---

## 🛠️ Dépannage Rapide

| Problème | Solution Rapide |
|----------|----------------|
| Sample non trouvé | Vérifier présence de `modsOptimizer-2025-12-10.json.sample` |
| Mode inconnu | Lancer `python3 preset_manager.py modes` |
| Preset vide | Vérifier que le sample contient des données |
| Erreur JSON | Régénérer le preset |

**→ Voir [README.md](README.md) section "Dépannage" pour plus de détails**

---

## 📈 Prochaines Étapes Suggérées

### Phase 1 : Adoption (Vous êtes ici)
- ✅ Système créé et documenté
- ✅ Exemples de presets générés
- ⏳ Tester avec différents modes
- ⏳ Valider in-game

### Phase 2 : Optimisation
- ⏳ Affiner les poids par mode
- ⏳ Créer presets hybrides
- ⏳ Documenter les résultats in-game

### Phase 3 : Partage
- ⏳ Partager avec la guilde
- ⏳ Collecter feedback
- ⏳ Créer presets communautaires

### Phase 4 : Intégration
- ⏳ Intégrer dans l'UI de l'app ?
- ⏳ Automatisation supplémentaire ?
- ⏳ Sync avec HotUtils ?

---

## 📞 Support et Contribution

### Questions
- Lire la documentation dans l'ordre suggéré
- Consulter [README.md](README.md) section dépannage
- Tester avec les exemples fournis

### Améliorer le Système
- Tester différentes stratégies in-game
- Documenter les résultats
- Proposer ajustements de poids
- Partager presets optimisés

---

## 📄 Fichiers du Système

### Documentation (5 fichiers)
- ✅ [INDEX.md](INDEX.md) - 📑 Ce fichier
- ✅ [README.md](README.md) - 📘 Documentation complète (14 KB)
- ✅ [QUICK_START.md](QUICK_START.md) - ⚡ Guide rapide (4.2 KB)
- ✅ [STRATEGIES.md](STRATEGIES.md) - 📊 Comparatif stratégies (8.5 KB)
- ✅ [modding-SWGOH.md](modding-SWGOH.md) - 🎮 Contexte modes (2.2 KB)

### Code et Données
- ✅ [preset_manager.py](preset_manager.py) - 🔧 Script principal (24 KB)
- ✅ [modsOptimizer-2025-12-10.json.sample](modsOptimizer-2025-12-10.json.sample) - 📦 Base (1.0 MB)

### Presets (16 dossiers)
- ✅ GAC_5v5/ (1 preset)
- ✅ RAID_NABOO/ (1 preset)
- ✅ FASTEST/ (1 preset)
- ✅ TANKY/ (1 preset)
- ⏳ 12 autres dossiers (vides, prêts)

**Total documentation :** ~29 KB
**Total presets :** ~6.4 MB
**Total système :** ~7.4 MB

---

## 🎯 Résumé en Une Ligne

**Système de gestion versionné pour générer, sauvegarder et appliquer des configurations de modding optimales pour chaque mode de jeu SWGOH.**

---

## 🚀 Commencer Maintenant

```bash
# 1. Lister les modes
python3 preset_manager.py modes

# 2. Générer votre premier preset
python3 preset_manager.py generate GAC_5v5 --description "Ma première config"

# 3. Voir le résultat
python3 preset_manager.py list GAC_5v5

# 4. Appliquer
python3 preset_manager.py apply GAC_5v5 2025-12-10_v1
```

**C'est parti !** 🎮

---

**Dernière mise à jour :** 2025-12-10
**Version :** 1.0
**Statut :** ✅ Opérationnel
