# Instructions pour lancer le projet

Le projet a un problème de compatibilité avec Node.js v22. Voici les solutions :

## Solution 1 : Utiliser le script de démarrage (RECOMMANDÉ)

```bash
./start.sh
```

## Solution 2 : Commande manuelle

```bash
export NODE_OPTIONS=--openssl-legacy-provider
npm start
```

## Solution 3 : Downgrade Node.js (si les autres ne fonctionnent pas)

Installer Node.js v16 avec nvm :

```bash
# Installer nvm si pas déjà fait
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Redémarrer le terminal puis :
nvm install 16
nvm use 16
npm start
```

## Solution 4 : Mettre à jour les dépendances (solution permanente)

```bash
# Mettre à jour browserslist
npx update-browserslist-db@latest

# Optionnel : mettre à jour react-scripts
npm install react-scripts@latest
```

## Une fois le serveur démarré

1. Ouvre ton navigateur sur `https://localhost:3000` ou `https://192.168.1.167/`
2. Accepte le certificat SSL auto-signé
3. Entre ton ally code pour charger tes données
4. Clique sur l'onglet **"My Mods sets"** dans la navigation
5. Teste la nouvelle fonctionnalité !

## En cas de problème

Si le serveur ne compile toujours pas après 2 minutes :

1. Tue tous les processus Node.js :
   ```bash
   pkill -f node
   ```

2. Nettoie le cache :
   ```bash
   rm -rf node_modules/.cache
   ```

3. Relance avec :
   ```bash
   ./start.sh
   ```
