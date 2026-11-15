# Loyck — site (version statique)

Vue 3 + Vite + GSAP. Tout le contenu est dans le dépôt : pas de CMS, pas de service externe pour le contenu.
La version avec administration Storyblok est sur la branche `main`.

## Lancer

Copier `.env.example` en `.env` (facultatif : sans réglage, le site tourne avec des créneaux de démo en dev).

| | Docker | Sans Docker |
|---|---|---|
| Site (prod, nginx) | `docker compose up -d --build` → http://localhost:8088 (port : `WEB_PORT`) | `npm run build` (dossier `dist/`, à déposer sur n'importe quel hébergement statique) |
| Dev (rechargement à chaud) | `docker compose --profile dev up dev` → http://localhost:5173 | `npm run dev` |

Après toute modification (contenu ou `.env`), reconstruire : `docker compose up -d --build`.

- Logo: `node scripts/split-logo.mjs <logo.svg> [--drop-letter=N]` regenerates `src/assets/logo-*.svg`.
- Checks: `node scripts/check-booking.mjs`.

## Contenu

Tout est dans **`src/content/home.json`** : une liste `sections`, dans l'ordre de la page. Chaque section a un
`component` (son type) et ses champs. Réordonner, dupliquer ou supprimer une entrée change la page d'autant.
Chaque `_uid` doit rester unique (n'importe quel texte).

| `component` | Champs |
|---|---|
| `hero` | aucun (le logo) |
| `marquee` | `tags` : mots séparés par des virgules |
| `about` | `title`, `text` (retour à la ligne : `\n`), `portrait` (image ou `null`) |
| `divider` | aucun (la frise à l'œil) |
| `works` | `title`, `items` : `{ "_uid", "component": "work", "year", "image" }` |
| `flashes` | `kicker`, `title`, `intro`, `items` : `{ "_uid", "component": "flash", "name", "size", "taken", "image" }` |
| `process` | `kicker`, `title`, `steps` : `{ "_uid", "component": "step", "title", "text" }` (numérotées I, II…) |
| `agenda` | `kicker`, `title`, `events` : `{ "_uid", "component": "event", "date": "AAAA-MM-JJ", "city", "place", "status": "open" \| "full" \| "soon" }` |
| `infos` | `kicker`, `title`, `blocks` : `{ "_uid", "component": "info", "title", "lines" (une puce par ligne, `\n`), "note" }` |
| `contact` | `kicker`, `title`, `text`, `email`, `instagram` |

**Images** : déposer le fichier dans `public/` (ex. `public/works/nouveau.jpg`), puis

```json
"image": { "filename": "/works/nouveau.jpg", "alt": "Une phrase qui décrit la pièce", "width": 800, "height": 1000 }
```

`width`/`height` : les dimensions réelles du fichier (évitent un saut de mise en page). Les redimensionner avant :
1000 px de haut suffisent (`sips -Z 1000 photo.jpg` sur Mac).

**Dates de l'agenda** : une date passée disparaît toute seule du site ; la phase de lune est calculée.

## Prise de rendez-vous

Le client choisit un jour et un créneau libres, décrit son projet, et la demande arrive par email.
Rien n'est réservé automatiquement : le créneau est confirmé à la main, après l'acompte.

Les créneaux pris viennent d'un **Google Agenda** : tout événement posé dedans (un RDV, un congé, une journée
entière bloquée) rend les créneaux qu'il recouvre indisponibles sur le site. Le site ne voit que les plages
occupées, jamais les noms ni les détails.

Horaires, jours d'ouverture et délai minimum : `CONFIG` en haut de `src/booking.js`.

### Mise en place (une fois, gratuit)

1. **Agenda** : dans Google Agenda, créer un agenda dédié (ex. « RDV tatouage »).
   Paramètres de l'agenda > Autorisations d'accès > cocher « Rendre disponible publiquement » et choisir
   **« Voir uniquement les infos disponible/occupé »**. Copier l'« ID de l'agenda » dans `VITE_GCAL_ID`.
2. **Clé Google** : sur console.cloud.google.com, créer un projet, activer « Google Calendar API », créer une
   clé API, la restreindre au domaine du site (référents HTTP) et à Calendar API. La mettre dans `VITE_GCAL_KEY`.
3. **Envoi des demandes** : sur web3forms.com, créer une clé d'accès avec l'adresse qui doit recevoir les
   demandes (gratuit jusqu'à 250 par mois). La mettre dans `VITE_WEB3FORMS_KEY`.
4. Remplir ces valeurs dans `.env`, puis reconstruire le site.

Tant qu'un réglage manque :
- sans agenda : en dev, de faux créneaux pris s'affichent pour tester ; en prod, tout apparaît libre ;
- sans clé Web3Forms : le bouton ouvre l'application mail du visiteur avec la demande pré-remplie.

### Au quotidien

Ajouter chaque RDV confirmé dans l'agenda « RDV tatouage » (depuis le téléphone, c'est immédiat).
Pour fermer un jour ou une période : un événement « journée entière » sur ces dates.
