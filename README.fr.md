# 9dok24 — Migratoire d'abonnements YouTube

<div align="center">

**Language / 언어 선택**

[🇰🇷 한국어](README.ko.md) | [🇺🇸 English](README.md) | 🇫🇷 **Français** | [🇨🇳 中文](README.zh.md) | [🇯🇵 日本語](README.ja.md)

</div>

---

Migrez vos abonnements YouTube d'un compte Google à un autre — rapidement, sélectivement, avec un suivi du quota API en temps réel.

---

## Fonctionnalités

- **Récupération des abonnements** — Chargez toutes les chaînes du compte source.
- **Transfert sélectif** — Recherchez et choisissez uniquement les chaînes à migrer.
- **Déduplication automatique** — Les chaînes déjà abonnées sur le compte destination sont ignorées.
- **Jauge de quota API** — Affiche les insertions YouTube Data API restantes (limite 200/jour) en temps réel.
- **Export JSON** — Enregistrez votre liste d'abonnements en fichier JSON.
- **Thème sombre / clair** — Basculez à tout moment depuis l'application.
- **Coréen / Anglais** — Interface entièrement localisée dans ces deux langues.

---

## Démarrage

### 1. Configuration Google Cloud (obligatoire)

Au premier lancement, l'application vous demande des identifiants OAuth. Suivez ces étapes :

1. Rendez-vous sur [Google Cloud Console](https://console.cloud.google.com/) → créez un nouveau projet.
2. Activez **YouTube Data API v3**.
3. Configurez l'**écran de consentement OAuth** → ajoutez vos comptes Google comme utilisateurs test.
4. Allez dans **Identifiants** → **Créer des identifiants OAuth** → type d'application : **Application de bureau**.
5. Saisissez le **Client ID** et le **Client Secret** générés dans l'application.

### 2. Lancer l'application

```bash
npm install
npm run dev
```

### 3. Processus de migration

1. **Connexion Google** — connectez-vous avec le compte *source* (celui à exporter).
2. **Récupérer les abonnements** — la liste de vos chaînes s'affiche.
3. **Sélectionner les chaînes** — recherchez et cochez celles à migrer (toutes sélectionnées par défaut).
4. **Transférer** — connectez-vous au compte *destination*, puis lancez le transfert.

> **Quota API :** YouTube Data API autorise ~200 insertions d'abonnements par jour. En cas de dépassement, reprenez le lendemain — les chaînes déjà migrées sont automatiquement ignorées.

---

## Stack technique

| Couche | Technologie |
|--------|-------------|
| Runtime | Electron 41 |
| UI | React 18 + TypeScript |
| Build | Vite + vite-plugin-electron |
| Style | Tailwind CSS + shadcn/ui (Radix) |
| Animation | Framer Motion |
| API | YouTube Data API v3 (OAuth2 PKCE) |
| Tests | Vitest + Testing Library, Playwright |

---

## Commandes de développement

```bash
npm run dev          # Serveur Vite + Electron (localhost:8080)
npm run build        # Compilation TypeScript + build Vite production
npm run lint         # ESLint
npm run test         # Vitest (exécution unique)
npm run test:watch   # Vitest mode surveillance
npm run pack         # electron-builder --dir → release/win-unpacked/
npm run dist         # electron-builder installeur complet → release/
```

---

## Licence

[MIT](LICENSE) © 2026 9dok24
