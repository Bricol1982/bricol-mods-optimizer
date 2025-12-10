#!/usr/bin/env python3
"""
SWGOH Mod Targets Preset Manager

Manages versioned mod configuration presets for different game modes.
Each preset is saved with date and version number for easy tracking.

Usage:
    python preset_manager.py generate <mode> [--description "desc"]
    python preset_manager.py list [mode]
    python preset_manager.py info <mode> <version>
    python preset_manager.py apply <mode> <version>
"""

import json
import os
import sys
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Any, Optional
import argparse
import shutil


class PresetManager:
    """Manages versioned preset configurations for SWGOH mod optimization."""

    # Game mode strategies with their stat priorities
    MODE_STRATEGIES = {
        'GAC_5v5': {
            'description': 'Grand Arena Championship 5v5 - Maximum Speed Priority',
            'default_target': {
                'name': 'GAC Speed',
                'speed': 100,
                'critChance': 50,
                'critDmg': 75,
                'potency': 25,
                'tenacity': 0,
                'physDmg': 40,
                'specDmg': 40,
                'health': 10,
                'protection': 10,
                'armor': 0,
                'resistance': 0,
                'accuracy': 0,
                'critAvoid': 0,
                'upgradeMods': True,
                'primaryStatRestrictions': {},
                'setRestrictions': {},
                'targetStats': [],
                'useOnlyFullSets': False
            }
        },
        'GAC_3v3': {
            'description': 'Grand Arena Championship 3v3 - Maximum Speed Priority',
            'default_target': {
                'name': 'GAC 3v3 Speed',
                'speed': 100,
                'critChance': 50,
                'critDmg': 75,
                'potency': 25,
                'tenacity': 0,
                'physDmg': 40,
                'specDmg': 40,
                'health': 10,
                'protection': 10,
                'armor': 0,
                'resistance': 0,
                'accuracy': 0,
                'critAvoid': 0,
                'upgradeMods': True,
                'primaryStatRestrictions': {},
                'setRestrictions': {},
                'targetStats': [],
                'useOnlyFullSets': False
            }
        },
        'RAID_NABOO': {
            'description': 'Battle for Naboo Raid - Damage Focus, Reduced Speed',
            'default_target': {
                'name': 'Naboo Raid',
                'speed': 25,
                'critChance': 75,
                'critDmg': 100,
                'potency': 40,
                'tenacity': 0,
                'physDmg': 75,
                'specDmg': 75,
                'health': 50,
                'protection': 40,
                'armor': 0,
                'resistance': 0,
                'accuracy': 0,
                'critAvoid': 0,
                'upgradeMods': True,
                'primaryStatRestrictions': {},
                'setRestrictions': {},
                'targetStats': [],
                'useOnlyFullSets': False
            }
        },
        'RAID_KRAYT': {
            'description': 'Krayt Dragon Raid - Potency and Offense Focus',
            'default_target': {
                'name': 'Krayt Raid',
                'speed': 50,
                'critChance': 60,
                'critDmg': 80,
                'potency': 75,
                'tenacity': 0,
                'physDmg': 70,
                'specDmg': 70,
                'health': 30,
                'protection': 30,
                'armor': 0,
                'resistance': 0,
                'accuracy': 0,
                'critAvoid': 0,
                'upgradeMods': True,
                'primaryStatRestrictions': {},
                'setRestrictions': {},
                'targetStats': [],
                'useOnlyFullSets': False
            }
        },
        'TB_ROTE': {
            'description': 'Rise of the Empire TB - Survival Focus',
            'default_target': {
                'name': 'ROTE TB',
                'speed': 75,
                'critChance': 30,
                'critDmg': 40,
                'potency': 20,
                'tenacity': 60,
                'physDmg': 40,
                'specDmg': 40,
                'health': 80,
                'protection': 80,
                'armor': 50,
                'resistance': 50,
                'accuracy': 0,
                'critAvoid': 0,
                'upgradeMods': True,
                'primaryStatRestrictions': {},
                'setRestrictions': {},
                'targetStats': [],
                'useOnlyFullSets': False
            }
        },
        'TB_DS': {
            'description': 'Dark Side Geonosis TB - Wave Clear Focus',
            'default_target': {
                'name': 'DS TB',
                'speed': 70,
                'critChance': 40,
                'critDmg': 50,
                'potency': 30,
                'tenacity': 40,
                'physDmg': 50,
                'specDmg': 50,
                'health': 60,
                'protection': 60,
                'armor': 30,
                'resistance': 30,
                'accuracy': 0,
                'critAvoid': 0,
                'upgradeMods': True,
                'primaryStatRestrictions': {},
                'setRestrictions': {},
                'targetStats': [],
                'useOnlyFullSets': False
            }
        },
        'TB_LS': {
            'description': 'Light Side TB - Wave Clear Focus',
            'default_target': {
                'name': 'LS TB',
                'speed': 70,
                'critChance': 40,
                'critDmg': 50,
                'potency': 30,
                'tenacity': 40,
                'physDmg': 50,
                'specDmg': 50,
                'health': 60,
                'protection': 60,
                'armor': 30,
                'resistance': 30,
                'accuracy': 0,
                'critAvoid': 0,
                'upgradeMods': True,
                'primaryStatRestrictions': {},
                'setRestrictions': {},
                'targetStats': [],
                'useOnlyFullSets': False
            }
        },
        'ARENA': {
            'description': 'Squad Arena - Training and Comfort',
            'default_target': {
                'name': 'Arena',
                'speed': 90,
                'critChance': 50,
                'critDmg': 70,
                'potency': 25,
                'tenacity': 0,
                'physDmg': 40,
                'specDmg': 40,
                'health': 15,
                'protection': 15,
                'armor': 0,
                'resistance': 0,
                'accuracy': 0,
                'critAvoid': 0,
                'upgradeMods': True,
                'primaryStatRestrictions': {},
                'setRestrictions': {},
                'targetStats': [],
                'useOnlyFullSets': False
            }
        },
        'CONQUEST': {
            'description': 'Conquest - Standard GAC (except specific feats)',
            'default_target': {
                'name': 'Conquest',
                'speed': 95,
                'critChance': 50,
                'critDmg': 75,
                'potency': 30,
                'tenacity': 0,
                'physDmg': 50,
                'specDmg': 50,
                'health': 20,
                'protection': 20,
                'armor': 0,
                'resistance': 0,
                'accuracy': 0,
                'critAvoid': 0,
                'upgradeMods': True,
                'primaryStatRestrictions': {},
                'setRestrictions': {},
                'targetStats': [],
                'useOnlyFullSets': False
            }
        },
        'JOURNEY': {
            'description': 'Journey Guide / Legendary - Specific Threshold Requirements',
            'default_target': {
                'name': 'Journey',
                'speed': 80,
                'critChance': 40,
                'critDmg': 50,
                'potency': 40,
                'tenacity': 40,
                'physDmg': 50,
                'specDmg': 50,
                'health': 50,
                'protection': 50,
                'armor': 20,
                'resistance': 20,
                'accuracy': 0,
                'critAvoid': 0,
                'upgradeMods': True,
                'primaryStatRestrictions': {},
                'setRestrictions': {},
                'targetStats': [],
                'useOnlyFullSets': False
            }
        },
        'CHALLENGES': {
            'description': 'Galactic Challenges - Temporary specific modding',
            'default_target': {
                'name': 'Challenge',
                'speed': 85,
                'critChance': 45,
                'critDmg': 60,
                'potency': 35,
                'tenacity': 35,
                'physDmg': 50,
                'specDmg': 50,
                'health': 40,
                'protection': 40,
                'armor': 20,
                'resistance': 20,
                'accuracy': 0,
                'critAvoid': 0,
                'upgradeMods': True,
                'primaryStatRestrictions': {},
                'setRestrictions': {},
                'targetStats': [],
                'useOnlyFullSets': False
            }
        },
        'REVAMISSION': {
            'description': 'Reva Mission (Inquisitors) - Specific Potency/Speed Thresholds',
            'default_target': {
                'name': 'Reva Mission',
                'speed': 85,
                'critChance': 30,
                'critDmg': 40,
                'potency': 80,
                'tenacity': 0,
                'physDmg': 50,
                'specDmg': 50,
                'health': 40,
                'protection': 40,
                'armor': 0,
                'resistance': 0,
                'accuracy': 0,
                'critAvoid': 0,
                'upgradeMods': True,
                'primaryStatRestrictions': {},
                'setRestrictions': {},
                'targetStats': [],
                'useOnlyFullSets': False
            }
        },
        'FASTEST': {
            'description': 'Fastest Characters - Absolute Speed Maximum (Thrawn, C-3PO, etc.)',
            'default_target': {
                'name': 'Maximum Speed',
                'speed': 100,
                'critChance': 0,
                'critDmg': 0,
                'potency': 20,
                'tenacity': 0,
                'physDmg': 0,
                'specDmg': 0,
                'health': 5,
                'protection': 5,
                'armor': 0,
                'resistance': 0,
                'accuracy': 0,
                'critAvoid': 0,
                'upgradeMods': True,
                'primaryStatRestrictions': {},
                'setRestrictions': {},
                'targetStats': [],
                'useOnlyFullSets': False
            }
        },
        'TANKY': {
            'description': 'Tanks & Support Defenders - Maximum Survivability',
            'default_target': {
                'name': 'Tank',
                'speed': 50,
                'critChance': 0,
                'critDmg': 0,
                'potency': 20,
                'tenacity': 60,
                'physDmg': 0,
                'specDmg': 0,
                'health': 100,
                'protection': 100,
                'armor': 80,
                'resistance': 80,
                'accuracy': 0,
                'critAvoid': 50,
                'upgradeMods': True,
                'primaryStatRestrictions': {},
                'setRestrictions': {},
                'targetStats': [],
                'useOnlyFullSets': False
            }
        },
        'BENCH': {
            'description': 'Unused Roster - Minimal Modding for GP Increase',
            'default_target': {
                'name': 'Bench GP',
                'speed': 20,
                'critChance': 20,
                'critDmg': 20,
                'potency': 20,
                'tenacity': 20,
                'physDmg': 20,
                'specDmg': 20,
                'health': 30,
                'protection': 30,
                'armor': 20,
                'resistance': 20,
                'accuracy': 0,
                'critAvoid': 0,
                'upgradeMods': False,
                'primaryStatRestrictions': {},
                'setRestrictions': {},
                'targetStats': [],
                'useOnlyFullSets': False
            }
        }
    }

    def __init__(self, base_dir: str = None):
        """Initialize the preset manager."""
        if base_dir is None:
            base_dir = Path(__file__).parent
        self.base_dir = Path(base_dir)
        self.sample_file = self.base_dir / 'modsOptimizer-2025-12-10.json.sample'

    def load_sample_data(self) -> Dict[str, Any]:
        """Load the base sample data."""
        if not self.sample_file.exists():
            raise FileNotFoundError(f"Sample file not found: {self.sample_file}")

        with open(self.sample_file, 'r', encoding='utf-8') as f:
            return json.load(f)

    def get_next_version(self, mode: str, date_str: str = None) -> str:
        """Get the next version number for a given mode and date."""
        if date_str is None:
            date_str = datetime.now().strftime('%Y-%m-%d')

        mode_dir = self.base_dir / mode
        if not mode_dir.exists():
            return f"{date_str}_v1"

        # Find existing versions for this date
        existing_files = list(mode_dir.glob(f"{date_str}_v*.json"))
        if not existing_files:
            return f"{date_str}_v1"

        # Extract version numbers
        versions = []
        for f in existing_files:
            try:
                version_part = f.stem.split('_v')[1]
                versions.append(int(version_part))
            except (IndexError, ValueError):
                continue

        next_version = max(versions) + 1 if versions else 1
        return f"{date_str}_v{next_version}"

    def apply_strategy_to_characters(self, data: Dict[str, Any], mode: str) -> Dict[str, Any]:
        """Apply the mode strategy to all characters in the data."""
        if mode not in self.MODE_STRATEGIES:
            raise ValueError(f"Unknown mode: {mode}. Available modes: {', '.join(self.MODE_STRATEGIES.keys())}")

        strategy = self.MODE_STRATEGIES[mode]
        default_target = strategy['default_target'].copy()

        # Modify the profiles
        for profile in data.get('profiles', []):
            characters = profile.get('characters', {})

            for char_id, char_data in characters.items():
                if 'optimizerSettings' not in char_data:
                    char_data['optimizerSettings'] = {
                        'targets': [],
                        'minimumModDots': 5,
                        'sliceMods': True,
                        'isLocked': False
                    }

                # Replace targets with mode-specific target
                char_data['optimizerSettings']['targets'] = [default_target.copy()]

        return data

    def generate_preset(self, mode: str, description: str = None, version: str = None) -> Path:
        """Generate a new preset for the specified mode.

        IMPORTANT: The generated JSON must use the same format as the .sample file
        (minified, no indentation, no newline at end) to ensure compatibility with
        the optimizer tool. DO NOT change the json.dump() parameters without testing
        import compatibility.
        """
        if mode not in self.MODE_STRATEGIES:
            raise ValueError(f"Unknown mode: {mode}. Available modes: {', '.join(self.MODE_STRATEGIES.keys())}")

        # Load base sample data
        print(f"Loading base sample data from {self.sample_file}...")
        data = self.load_sample_data()

        # Apply strategy
        print(f"Applying {mode} strategy to all characters...")
        data = self.apply_strategy_to_characters(data, mode)

        # Add metadata
        if 'metadata' not in data:
            data['metadata'] = {}

        data['metadata']['mode'] = mode
        data['metadata']['strategy'] = self.MODE_STRATEGIES[mode]['description']
        data['metadata']['generated_at'] = datetime.now().isoformat()
        data['metadata']['generated_from'] = str(self.sample_file.name)
        if description:
            data['metadata']['description'] = description

        # Get version
        if version is None:
            version = self.get_next_version(mode)

        # Create mode directory if it doesn't exist
        mode_dir = self.base_dir / mode
        mode_dir.mkdir(exist_ok=True)

        # Save preset
        output_file = mode_dir / f"{version}.json"
        print(f"Saving preset to {output_file}...")

        with open(output_file, 'w', encoding='utf-8') as f:
            # Use compact format (no indent) to match the .sample file format
            # This ensures compatibility with the optimizer tool
            json.dump(data, f, ensure_ascii=False, separators=(',', ':'))

        print(f"✓ Preset generated successfully!")
        print(f"  Mode: {mode}")
        print(f"  Version: {version}")
        print(f"  File: {output_file}")
        print(f"  Strategy: {self.MODE_STRATEGIES[mode]['description']}")

        return output_file

    def list_presets(self, mode: str = None) -> Dict[str, List[Dict[str, Any]]]:
        """List all presets, optionally filtered by mode."""
        results = {}

        modes = [mode] if mode else self.MODE_STRATEGIES.keys()

        for m in modes:
            mode_dir = self.base_dir / m
            if not mode_dir.exists():
                results[m] = []
                continue

            presets = []
            for preset_file in sorted(mode_dir.glob('*.json'), reverse=True):
                try:
                    with open(preset_file, 'r', encoding='utf-8') as f:
                        data = json.load(f)

                    metadata = data.get('metadata', {})
                    presets.append({
                        'file': preset_file.name,
                        'path': str(preset_file),
                        'version': preset_file.stem,
                        'generated_at': metadata.get('generated_at', 'Unknown'),
                        'description': metadata.get('description', ''),
                        'strategy': metadata.get('strategy', self.MODE_STRATEGIES[m]['description'])
                    })
                except Exception as e:
                    print(f"Warning: Could not read {preset_file}: {e}", file=sys.stderr)

            results[m] = presets

        return results

    def get_preset_info(self, mode: str, version: str) -> Dict[str, Any]:
        """Get detailed information about a specific preset."""
        preset_file = self.base_dir / mode / f"{version}.json"

        if not preset_file.exists():
            raise FileNotFoundError(f"Preset not found: {preset_file}")

        with open(preset_file, 'r', encoding='utf-8') as f:
            data = json.load(f)

        metadata = data.get('metadata', {})

        # Count characters
        char_count = 0
        for profile in data.get('profiles', []):
            char_count += len(profile.get('characters', {}))

        info = {
            'mode': mode,
            'version': version,
            'file': str(preset_file),
            'metadata': metadata,
            'character_count': char_count,
            'profile_count': len(data.get('profiles', [])),
            'file_size': preset_file.stat().st_size,
        }

        return info

    def apply_preset(self, mode: str, version: str, output_file: str = None) -> Path:
        """Apply a preset by copying it to the specified location."""
        preset_file = self.base_dir / mode / f"{version}.json"

        if not preset_file.exists():
            raise FileNotFoundError(f"Preset not found: {preset_file}")

        if output_file is None:
            # Default to copying to parent directory
            output_file = self.base_dir.parent / f"modsOptimizer-{mode}-{version}.json"

        output_path = Path(output_file)
        shutil.copy2(preset_file, output_path)

        print(f"✓ Preset applied!")
        print(f"  From: {preset_file}")
        print(f"  To: {output_path}")

        return output_path


def main():
    """CLI entry point."""
    parser = argparse.ArgumentParser(
        description='SWGOH Mod Targets Preset Manager',
        formatter_class=argparse.RawDescriptionHelpFormatter
    )

    subparsers = parser.add_subparsers(dest='command', help='Command to execute')

    # Generate command
    gen_parser = subparsers.add_parser('generate', help='Generate a new preset for a mode')
    gen_parser.add_argument('mode', help='Game mode (e.g., GAC_5v5, RAID_NABOO)')
    gen_parser.add_argument('--description', '-d', help='Optional description for this preset')
    gen_parser.add_argument('--version', '-v', help='Custom version (default: auto-generated YYYY-MM-DD_vN)')

    # List command
    list_parser = subparsers.add_parser('list', help='List all presets')
    list_parser.add_argument('mode', nargs='?', help='Filter by game mode')

    # Info command
    info_parser = subparsers.add_parser('info', help='Get detailed info about a preset')
    info_parser.add_argument('mode', help='Game mode')
    info_parser.add_argument('version', help='Version (e.g., 2025-12-10_v1)')

    # Apply command
    apply_parser = subparsers.add_parser('apply', help='Apply a preset')
    apply_parser.add_argument('mode', help='Game mode')
    apply_parser.add_argument('version', help='Version (e.g., 2025-12-10_v1)')
    apply_parser.add_argument('--output', '-o', help='Output file path')

    # Modes command
    modes_parser = subparsers.add_parser('modes', help='List available game modes')

    args = parser.parse_args()

    if not args.command:
        parser.print_help()
        return 1

    manager = PresetManager()

    try:
        if args.command == 'generate':
            manager.generate_preset(args.mode, args.description, args.version)

        elif args.command == 'list':
            presets = manager.list_presets(args.mode)

            for mode, preset_list in presets.items():
                print(f"\n{mode}:")
                print("=" * 80)

                if not preset_list:
                    print("  No presets found")
                    continue

                for preset in preset_list:
                    print(f"  {preset['version']}")
                    print(f"    Generated: {preset['generated_at']}")
                    if preset['description']:
                        print(f"    Description: {preset['description']}")
                    print(f"    Strategy: {preset['strategy']}")
                    print()

        elif args.command == 'info':
            info = manager.get_preset_info(args.mode, args.version)

            print(f"\nPreset Information:")
            print("=" * 80)
            print(f"Mode: {info['mode']}")
            print(f"Version: {info['version']}")
            print(f"File: {info['file']}")
            print(f"File Size: {info['file_size']:,} bytes")
            print(f"Characters: {info['character_count']}")
            print(f"Profiles: {info['profile_count']}")
            print("\nMetadata:")
            for key, value in info['metadata'].items():
                print(f"  {key}: {value}")

        elif args.command == 'apply':
            manager.apply_preset(args.mode, args.version, args.output)

        elif args.command == 'modes':
            print("\nAvailable Game Modes:")
            print("=" * 80)
            for mode, strategy in manager.MODE_STRATEGIES.items():
                print(f"{mode}")
                print(f"  {strategy['description']}")
                print()

        return 0

    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        return 1


if __name__ == '__main__':
    sys.exit(main())
