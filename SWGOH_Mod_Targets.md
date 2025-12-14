# 🎯 SWGOH Mod Targets - Système de Presets Versionnés

## Vue d'ensemble

Système complet de gestion des configurations de modding pour Star Wars: Galaxy of Heroes, permettant de générer, versionner et appliquer rapidement des presets optimisés pour chaque mode de jeu.

## 📁 Localisation

Le système complet se trouve dans le dossier **`SWGOH_Mod_Targets/`**

## 🚀 Démarrage Rapide

```bash
cd SWGOH_Mod_Targets

# Voir les modes disponibles
python3 preset_manager.py modes

# Générer un preset pour GAC
python3 preset_manager.py generate GAC_5v5 --description "Ma config GAC"

# Lister les presets
python3 preset_manager.py list

# Appliquer un preset
python3 preset_manager.py apply GAC_5v5 2025-12-10_v1
```

## 📚 Documentation Complète

Consultez les fichiers suivants dans `SWGOH_Mod_Targets/` :

- **[INDEX.md](SWGOH_Mod_Targets/INDEX.md)** - Navigation et vue d'ensemble
- **[QUICK_START.md](SWGOH_Mod_Targets/QUICK_START.md)** - Guide de démarrage rapide
- **[README.md](SWGOH_Mod_Targets/README.md)** - Documentation technique complète
- **[STRATEGIES.md](SWGOH_Mod_Targets/STRATEGIES.md)** - Comparatif des stratégies
- **[SYSTEM_SUMMARY.txt](SWGOH_Mod_Targets/SYSTEM_SUMMARY.txt)** - Récapitulatif système

## 🎮 Modes Disponibles (16)

### PvP
- GAC_5v5, GAC_3v3, ARENA

### Raids
- RAID_NABOO, RAID_KRAYT

### Territory Battles
- TB_ROTE, TB_DS, TB_LS

### PvE Solo
- CONQUEST, JOURNEY, CHALLENGES, REVAMISSION

### Catégories Spéciales
- FASTEST, TANKY, BENCH

## ✨ Fonctionnalités

- ✅ Génération automatique de presets
- ✅ Versioning par date (YYYY-MM-DD_vN)
- ✅ 16 stratégies pré-configurées
- ✅ Application en 1 commande
- ✅ Historique complet
- ✅ Compatible Bricol, HotUtils, C-3PO

## 📊 Statistiques

- **Modes configurés :** 16
- **Documentation :** 6 fichiers (~35 KB)
- **Code :** ~600 lignes Python
- **Presets exemples :** 4 générés
- **Base de données :** 291 personnages

## 🎯 Statut

**✅ OPÉRATIONNEL** - Système complet, testé et documenté

---

**Pour plus de détails, consultez [`SWGOH_Mod_Targets/INDEX.md`](SWGOH_Mod_Targets/INDEX.md)**
