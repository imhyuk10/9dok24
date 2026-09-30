# 9dok24 — Migrateur d'abonnements YouTube

<div align="center">

<p>
  <img src="public/9dok24_icon.png" alt="Logo 9dok24" width="160" />
</p>

**Language / 언어 선택**

[🇰🇷 한국어](README.ko.md) | [🇺🇸 English](README.md) | 🇫🇷 **Français** | [🇨🇳 中文](README.zh.md) | [🇯🇵 日本語](README.ja.md)

</div>

---

Migrez vos abonnements YouTube vers un autre compte Google à partir d'un CSV Google Takeout — sans connexion au compte source, sélectif, reprenable, avec une jauge de quota API intégrée.

---

## Fonctionnalités

- **Import CSV Takeout** — Chargez votre liste de chaînes depuis le `subscriptions.csv` de Google Takeout. Clic ou glisser-déposer. Le compte source n'a jamais besoin de se connecter.
- **Persistance locale** — La liste importée et l'état de chaque chaîne (terminé / ignoré / échec / en attente) sont enregistrés localement. Importez le CSV une seule fois ; chaque lancement suivant reprend où vous en étiez.
- **Édition sans connexion** — Ajoutez des chaînes en collant une URL ou un ID `UC…`, supprimez des lignes, sélectionnez un sous-ensemble. Tout hors ligne.
- **Enregistrement CSV de la liste modifiée** — Enregistrez vos ajouts/retraits dans un CSV au format Takeout, réimportable à tout moment pour reprendre.
- **Détection des doublons** — Les chaînes déjà suivies sur le compte de destination sont détectées en amont et ignorées sans coût de quota.
- **Vignettes et titres auto-complétés** — Après connexion, les avatars et titres manquants sont récupérés par lots de 50 et mis en cache.
- **Jauge de quota API** — Une jauge segmentée dans la barre supérieure suit les insertions quotidiennes face à la limite de 200/jour.
- **OAuth annulable** — La connexion attend jusqu'à 5 minutes et peut être annulée à tout moment.
- **Export JSON** — Enregistrez la liste (avec les états) en JSON.
- **Thème clair / sombre** — Clair par défaut. Interface en 한국어 / English / Français / 中文 / 日本語.

---

## Capture d'écran

![Console 9dok24](public/screenshot.png)

*La console : registre des chaînes avec état par ligne, connexion du compte de destination, et jauge de quota API dans la barre supérieure.*

---

## Démarrage

### 1. Configuration Google Cloud (obligatoire)

Au premier lancement, l'application demande des identifiants OAuth :

1. [Google Cloud Console](https://console.cloud.google.com/) → créez un nouveau projet.
2. Activez **YouTube Data API v3**.
3. Configurez l'**écran de consentement OAuth** → gardez l'application en mode *Test* et ajoutez le compte de destination comme **utilisateur test**.
4. **Identifiants** → **Créer un ID client OAuth** → type : **Application de bureau**.
5. Saisissez le **Client ID** et le **Client Secret** dans l'application.

### 2. Obtenir le CSV d'abonnements

1. Ouvrez [Google Takeout](https://takeout.google.com/) avec le compte *source*.
2. Sélectionnez uniquement **YouTube et YouTube Music** → incluez **subscriptions**.
3. Exportez, téléchargez l'archive et localisez `subscriptions.csv`.

### 3. Lancer l'application

```bash
npm install
npm run dev
```

### 4. Déroulement de la migration

1. **Importez le CSV** — cliquez sur la zone de dépôt ou glissez le fichier. La liste est enregistrée localement : c'est une étape unique.
2. **Vérifiez la liste** — recherchez, désélectionnez, supprimez des lignes ou ajoutez des chaînes par URL/ID. Vous pouvez aussi enregistrer la liste modifiée en CSV réimportable à tout moment (💾 dans la barre d'outils).
3. **Connectez le compte de destination** — l'écran de consentement Google s'ouvre dans le navigateur (l'avertissement « application non validée » est normal pour un client OAuth personnel : *Paramètres avancés → Continuer*).
4. **Transférez** — les chaînes déjà suivies sont ignorées ; les autres sont abonnées une à une avec un état en direct par ligne.

> **Note sur le quota :** l'API YouTube autorise ~200 insertions d'abonnement par jour (réinitialisation à minuit, heure du Pacifique). Si la limite est atteinte, relancez le lendemain — les chaînes terminées sont mémorisées et ignorées.

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
npm run build        # Compilation TypeScript + build de production Vite
npm run lint         # ESLint
npm run test         # Vitest (exécution unique)
npm run test:watch   # Vitest en mode watch
npm run pack         # electron-builder --dir → release/win-unpacked/
npm run dist         # Installateur complet electron-builder → release/
```

Ouvrir `localhost:8080` dans un navigateur classique active un mock de l'API Electron
réservé au développement (`?mock=list` / `?mock=empty` / `?mock=setup`).

---

## Licence

[MIT](LICENSE) © 2026 9dok24
