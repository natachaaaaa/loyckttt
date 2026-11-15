# Loyck — site

Vue 3 + Vite + GSAP, contenu géré dans Storyblok.

## Lancer

Copier `.env.example` en `.env` et le remplir (tout est facultatif : sans réglage, le site tourne avec le
contenu embarqué et des créneaux de démo).

| | Docker | Sans Docker |
|---|---|---|
| Site (prod, nginx) | `docker compose up -d --build` → http://localhost:8088 (port : `WEB_PORT`) | `npm run build` |
| Dev (hot reload, https) | `docker compose --profile dev up dev` → https://localhost:5173 | `npm run dev:editor` |
| Préconfigurer Storyblok | `docker compose run --rm storyblok-setup` | `npm run storyblok:setup` |

Les variables `VITE_*` sont figées au build : après les avoir changées, reconstruire (`--build`).
Le contenu, lui, est lu en direct chez Storyblok : publier suffit, pas besoin de reconstruire.

- Logo: `node scripts/split-logo.mjs <logo.svg> [--drop-letter=N]` regenerates `src/assets/logo-*.svg`.
- Checks: `node scripts/check-booking.mjs`.

## Contenu : Storyblok

Chaque section de la page est un bloc Storyblok (Logo, Bandeau, Qui suis-je, Réalisations, Flashs, Déroulé,
Guests & conventions, Infos pratiques, Prise de rendez-vous, Frise). Dans l'éditeur visuel, on clique sur une
section du vrai site pour la modifier ; on peut aussi les réordonner, les dupliquer ou en retirer.

### Mise en place (une fois)

1. Créer un compte sur storyblok.com et un **espace vide** (offre gratuite). Noter sa région (EU par défaut).
2. Remplir dans `.env` :
   - `STORYBLOK_SPACE_ID` : Paramètres de l'espace > Général ;
   - `STORYBLOK_PAT` : Mon compte > Personal access tokens (secret, ne sert qu'au script) ;
   - `VITE_STORYBLOK_TOKEN` : Paramètres de l'espace > Access tokens > token « Preview » ;
   - `SITE_URL` : l'adresse https du site (en local : `https://localhost:5173/`).
3. Lancer `docker compose run --rm storyblok-setup`. Le script crée tous les types de blocs, téléverse les
   photos des réalisations, remplit et publie la page `home` avec le contenu actuel, et règle l'URL de
   l'éditeur visuel. Le relancer est sans danger : il ne touche pas à une page déjà remplie
   (`... storyblok-setup --reset` pour tout remettre à zéro, en écrasant les modifications).
4. Reconstruire le site (`docker compose up -d --build`).

En local, l'éditeur visuel reste blanc tant que le navigateur refuse le certificat de https://localhost:5173.
Deux options :

- rapide : ouvrir une fois https://localhost:5173 dans le navigateur, « Avancé » > « Continuer » ;
- durable : un certificat reconnu par la machine (ajoute une autorité locale aux certificats de confiance) :

  ```bash
  brew install mkcert && mkcert -install
  mkdir -p certs && mkcert -cert-file certs/localhost.pem -key-file certs/localhost-key.pem localhost
  ```

  puis relancer le dev. `vite.config.js` utilise `certs/` automatiquement s'il existe.

### Au quotidien

- **Ajouter un tatouage** : bloc Réalisations > Tatouages > + Tatouage, choisir la photo (remplir son texte
  alternatif : une phrase qui décrit la pièce), l'année. Publier. Les photos sont redimensionnées par Storyblok :
  on peut téléverser l'original.
- **Flash réservé** : cocher « Réservé ». **Date passée** : elle disparaît toute seule du site.
- **Brouillon** : l'éditeur montre les brouillons ; le site public n'affiche que ce qui est publié.

Si Storyblok ne répond pas, le site affiche le contenu embarqué (`src/content/home.json`) au lieu d'une page
vide. Il n'est pas synchronisé : c'est un filet de sécurité, pas une sauvegarde.

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
