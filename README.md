# 🇲🇦 Smart Orga - Voyages Organisés au Maroc

Site web moderne, responsive et optimisé pour l'agence de voyages **Smart Orga**, spécialisée dans les séjours organisés en groupe et sur-mesure au Maroc (Désert de Merzouga, Dakhla, Chefchaouen, Taghazout, Marrakech, Cascades d'Ouzoud, Atlas).

---

## 🌟 Fonctionnalités Clés

- **Système de Réservation WhatsApp Automatisé** : Génère en un clic un lien `https://wa.me/2126XXXXXXXX?text=...` pré-rempli avec le nom du séjour, la date souhaitée, la ville de départ et le nombre de personnes.
- **Barre de Recherche & Filtres Avancés** :
  - Recherche par mot-clé (Cascades, Riad, Kitesurf, Trek...)
  - Sélecteur de destination (Merzouga, Dakhla, Chefchaouen, etc.)
  - Curseur de budget max en Dirhams Marocains (MAD)
  - Filtres par univers (Désert & Dunes, Villes Impériales, Nature, Plages)
  - Filtres par catégorie (Populaires, Hebdomadaires, À Venir)
- **Fiches Détaillées & Modal de Programme** : Jour par jour, inclus / non inclus, points forts et conseils.
- **Formulaire de Voyage Sur-Mesure** : Pour familles, amis, team-buildings d'entreprise et comités d'entreprise.
- **Double version disponible** :
  1. **Version Vite + React 19** (`src/`) avec icônes Lucide et bundle de production ultra-rapide dans `dist/`.
  2. **Version Fichier Unique Autonome** (`public/standalone.html`) en pur HTML5 + Tailwind CSS CDN + JavaScript Vanilla, sans aucune installation requise !

---

## 🚀 Guide de Déploiement : GitHub & Cloudflare

### Étape 1 : Publier le code sur GitHub

1. **Créer un nouveau dépôt sur GitHub** :
   - Rendez-vous sur [github.com](https://github.com) et cliquez sur **New repository**.
   - Nommez le dépôt, par exemple `smart-orga-maroc`.
   - Laissez-le en **Public** (ou Privé selon votre choix) et ne cochez pas l'initialisation automatique avec README.

2. **Pousser votre code local vers GitHub** (dans le terminal à la racine du projet) :
   ```bash
   git init
   git add .
   git commit -m "feat: site Smart Orga complet avec réservation WhatsApp"
   git branch -M main
   git remote add origin https://github.com/VOTRE_NOM_UTILISATEUR/smart-orga-maroc.git
   git push -u origin main
   ```

---

### Étape 2 (Option A - Recommandée) : Déployer sur Cloudflare Pages

Cloudflare Pages offre un hébergement gratuit, ultra-rapide avec CDN mondial et certificats SSL automatiques.

1. Connectez-vous sur votre tableau de bord [Cloudflare](https://dash.cloudflare.com/).
2. Allez dans **Workers & Pages** > **Create application** > onglet **Pages**.
3. Cliquez sur **Connect to Git** et sélectionnez votre dépôt `smart-orga-maroc`.
4. Configurez les paramètres de build :
   - **Framework preset** : `Vite`
   - **Build command** : `npm run build`
   - **Build output directory** : `dist`
5. Cliquez sur **Save and Deploy**.
6. En moins d'une minute, votre site est en ligne avec une URL sécurisée du type `https://smart-orga-maroc.pages.dev` !

> 💡 *Si vous préférez déployer le fichier unique sans étape de build, choisissez simplement l'onglet "Direct Upload" sur Cloudflare Pages et glissez-déposez le contenu du dossier `public/standalone.html` renommé en `index.html`.*

---

### Étape 2 (Option B) : Déployer sur GitHub Pages

1. Allez dans les paramètres de votre dépôt GitHub (**Settings** > **Pages**).
2. Sous **Build and deployment** :
   - **Source** : `GitHub Actions`.
3. GitHub détectera automatiquement Vite ou vous pouvez utiliser le fichier `public/standalone.html` directement sur la branche `main` dans le dossier `/docs` ou à la racine.

---

### Étape 3 : Configurer votre Propre Nom de Domaine avec Cloudflare DNS

Pour lier votre propre nom de domaine (ex: `smartorga.ma` ou `smartorga.com`) :

1. Dans **Cloudflare Pages** > Votre projet > Onglet **Custom domains**.
2. Cliquez sur **Set up a custom domain** et entrez votre domaine (ex: `smartorga.ma` ou `www.smartorga.ma`).
3. Cloudflare configurera automatiquement les enregistrements DNS nécessaires :
   - Type : `CNAME`
   - Nom : `@` ou `www`
   - Cible : `<votre-projet>.pages.dev`
   - Proxy status : **Proxied (Nuage Orange activé)** pour bénéficier de la protection DDoS, du cache CDN et du SSL gratuit.
4. Dans l'onglet **SSL/TLS** de Cloudflare, assurez-vous que le mode est réglé sur **Full** ou **Flexible**, et activez l'option **Always Use HTTPS**.

---

## ⚙️ Personnalisation Rapide

- **Numéro WhatsApp de l'agence** :
  Modifiez la variable `WHATSAPP_NUMBER` dans le fichier `src/data/tripsData.ts` (ou dans `standalone.html`) :
  ```typescript
  export const WHATSAPP_NUMBER = '2126XXXXXXXX'; // Numéro marocain au format international
  ```
- **Ajouter ou modifier des voyages** :
  Ajoutez simplement un objet voyage dans le tableau `TRIPS_DATA` de `src/data/tripsData.ts` avec le titre, la durée, le prix en MAD et les points forts.

---

## 🛠️ Commandes Locales pour le Développement

```bash
# Lancer le serveur de développement local
npm run dev

# Tester la compilation de production
npm run build

# Vérifier les types TypeScript
npm run lint
```
