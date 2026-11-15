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

- Checks: `node scripts/check-booking.mjs`.
- `npm run build` pré-génère le HTML complet de la page (`scripts/prerender.mjs`) : les moteurs de recherche
  lisent tout le contenu sans exécuter de JavaScript.

### Logo

Après un changement de logo :

```bash
node scripts/split-logo.mjs <logo.svg> [--drop-letter=N]
swiftc -O scripts/render-logo.swift -o /tmp/render-logo
/tmp/render-logo src/assets/logo-roots.svg src/assets/logo-roots.svg /tmp/r.png 2432 1071 1 && cwebp -q 80 /tmp/r.png -o src/assets/logo-roots-2432.webp
/tmp/render-logo src/assets/logo-roots.svg src/assets/logo-roots.svg /tmp/r.png 1216 536 1 && cwebp -q 80 /tmp/r.png -o src/assets/logo-roots-1216.webp
sed 's/currentColor/#f0ebe3/g' src/assets/logo-letters.svg > /tmp/l.svg && /tmp/render-logo /tmp/l.svg src/assets/logo-roots.svg /tmp/og.png 1200 630 0.86 "TATOUEUR À CASTRES" && sips -s format jpeg /tmp/og.png --out public/og-image.jpg
```

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
| `works` | `title`, `subtitle`, `items` : `{ "_uid", "component": "work", "year", "image" }` |
| `flashes` | `kicker`, `title`, `intro`, `items` : `{ "_uid", "component": "flash", "name", "size", "taken", "image" }` |
| `process` | `kicker`, `title`, `steps` : `{ "_uid", "component": "step", "title", "text" }` (numérotées I, II…) |
| `agenda` | `kicker`, `title`, `events` : `{ "_uid", "component": "event", "date": "AAAA-MM-JJ", "city", "place", "status": "open" \| "full" \| "soon" }` |
| `infos` | `kicker`, `title`, `blocks` : `{ "_uid", "component": "info", "title", "lines" (une puce par ligne, `\n`), "note", "address": true (affiche le salon de business.json) }` |
| `faq` | `kicker`, `title`, `items` : `{ "_uid", "question", "answer" }` (aussi publiées en données structurées) |
| `contact` | `kicker`, `title`, `text`, `email`, `instagram` |

**Images** : déposer le fichier dans `public/` (ex. `public/works/nouveau.jpg`), puis

```json
"image": { "filename": "/works/nouveau.jpg", "alt": "Une phrase qui décrit la pièce", "width": 800, "height": 1000 }
```

`width`/`height` : les dimensions réelles du fichier (évitent un saut de mise en page). Les redimensionner avant :
1000 px de haut suffisent (`sips -Z 1000 photo.jpg` sur Mac).

**Dates de l'agenda** : une date passée disparaît toute seule du site ; la phase de lune est calculée.

## Référencement : « tatoueur Castres »

### Ce que fait le site

- **HTML pré-généré** au build : titre, h1 (« Loyck, Tatoueur à Castres »), textes, FAQ et adresse sont dans le
  HTML envoyé à Google, pas seulement dans le JavaScript.
- **Balises** (`index.html`) : titre et description ciblés, Open Graph / Twitter (image `public/og-image.jpg`),
  géolocalisation Castres (FR-81), favicon et icône.
- **Données structurées** (JSON-LD, `src/seo.js`) : Loyck (`Person`) qui travaille au salon
  (`TattooParlor` Tigroo Tattoo Piercing, avec adresse), le site (`WebSite`) et la FAQ (`FAQPage`).
- **Contenu** : bio, sous-titres, FAQ locale (Castres, Tarn, Albi, Mazamet, Toulouse…), textes alternatifs
  des photos, nom/adresse/téléphone du salon dans les infos pratiques et le pied de page.
- **Vitesse** : image du logo en WebP adaptée à l'écran (LCP), widget de RDV chargé côté navigateur.
- `robots.txt`, et `sitemap.xml` + URL canonique dès que `siteUrl` est rempli.

### À remplir : `src/content/business.json`

| Champ | Pourquoi |
|---|---|
| `siteUrl` | **Obligatoire avant la mise en ligne** (ex. `https://loyck-tattoo.fr`) : URL canonique, sitemap, image de partage. |
| `salon.streetAddress`, `salon.phone` | Pré-remplis depuis des annuaires : **à vérifier** contre la fiche Google du salon, au caractère près. |
| `salon.latitude` / `longitude` | Position exacte du salon (clic droit sur Google Maps). |
| `salon.openingHours` | Format `"Tu-Sa 10:00-19:00"`, identique à la fiche Google. |
| `salon.googleBusinessUrl` | Lien de la fiche Google du salon. |

Un champ vide n'est pas publié : ne rien y mettre d'approximatif.

Vérifier après mise en ligne : [Test des résultats enrichis](https://search.google.com/test/rich-results) et
[Search Console](https://search.google.com/search-console) (valider le domaine, envoyer `sitemap.xml`).

### Hors du site : ce qui pèse le plus pour la 1re place

Sur « tatoueur Castres », Google affiche d'abord la carte avec 3 fiches d'établissements : c'est la fiche
**Google Business Profile du salon** qui s'y classe, pas le site seul.

1. **Fiche Google du salon** : catégorie « Salon de tatouage », photos des tatouages de Loyck, posts réguliers,
   et un lien vers ce site (bouton site web ou lien « réserver »).
2. **Avis Google** sur la fiche du salon : en demander après chaque séance, qui mentionnent naturellement
   le tatouage et Castres. Répondre à chacun.
3. **Même nom, adresse, téléphone partout** : fiche Google, site, Instagram, PagesJaunes, annuaires.
4. **Liens vers le site** : bio Instagram de Loyck et du salon, site du salon (page artiste), conventions,
   presse locale, annuaires de tatoueurs.
5. **Nom de domaine** court et lisible (le mot-clé dans le domaine n'est pas nécessaire).

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
