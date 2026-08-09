# Mondo × Atlas — Internet Ready Travel OS

## Ce projet
Cette version est une refonte profonde autour de quatre objectifs :
1. le visuel doit vendre l’aventure,
2. tout élément qui ressemble à une action doit être cliquable,
3. Atlas doit remplacer les nombreux onglets ouverts pendant une préparation de voyage,
4. les cartes sont des interfaces de décision, pas des illustrations.

## Recherche design intégrée
La direction s’appuie notamment sur :
- Awwwards : storytelling visuel et interaction,
- Mapbox / MapLibre : cartes 3D, POI, interactions et isochrones,
- Polarsteps cité par Mapbox comme exemple de POI touristiques interactifs,
- Airbnb : réduction de friction et personnalisation,
- Booking.com Demand API : recherche, contenu et redirection affiliée.

## MONDO
- Hero backpackers local : `assets/mondo-backpackers.jpg`
- ciel clair, littoral, groupe jeune, esprit aventure/rencontre
- globe Globe.gl avec vrais contours pays en GeoJSON
- survol pays : contour, élévation, panneau pays
- maintien ~0,7 sec : zoom pays
- villes touristiques cliquables
- Mondo Journal
- voyages, groupe, blog, communauté

## ATLAS
- Travel OS par ville
- 20 villes initiales :
Tokyo, Bangkok, Seoul, Singapore, Dubai,
Paris, London, Rome, Istanbul, Barcelona,
New York, Los Angeles, Mexico City, Rio de Janeiro, Miami,
Marrakech, Cairo, Cape Town, Zanzibar, Nairobi.
- chaque ville possède plusieurs quartiers et un profil :
nightlife, family, budget, premium, culture, etc.
- City Hub :
Vue d’ensemble / Quartiers / Hôtels / Visa / Météo / Activités / Food / Transports / Guides
- MapLibre + OpenFreeMap
- carte inclinée 3D
- zones quartier colorées
- marqueurs quartiers
- hôtels
- interactions click/flyTo
- couche bâtiments 3D si disponible dans le style

## 50 hôtels par ville
`data.js` contient 50 **candidats de démonstration** par ville, soit 1000 emplacements catalogue.
Ils ne sont PAS présentés comme de vrais hôtels audités.

Pourquoi ?
Sans vos identifiants d’affiliation/API, il serait trompeur d’inventer des disponibilités, prix ou audits réels.

### Passage à l’inventaire Booking.com réel
Le dossier `/api/hotels.js` contient un proxy Vercel pour Booking.com Demand API.

Variables d’environnement à ajouter dans Vercel :
- `BOOKING_API_KEY`
- `BOOKING_AFFILIATE_ID`
- `BOOKING_CITY_IDS_JSON`

Exemple :
`BOOKING_CITY_IDS_JSON={"Tokyo":-246227}`

Ne mettez JAMAIS la clé Booking directement dans `app.js`.

Booking.com Demand API v3 utilise :
- `Authorization: Bearer <key>`
- `X-Affiliate-Id: <aid>`

L’API renvoie également les URLs de redirection avec l’affiliate id pour attribution.

## Affiliation
Le fallback statique ouvre actuellement une recherche Booking.com par ville.
Ajoutez votre AID via :
`localStorage.setItem("bookingAid","VOTRE_AID")`

Pour production, privilégiez le Demand API côté serveur afin d’obtenir inventaire, disponibilité et liens d’attribution corrects.

## Comment tester
Servir le dossier avec un serveur local :
`python3 -m http.server 8000`
puis :
`http://localhost:8000`

Internet est requis pour :
- Globe.gl
- texture globe
- GeoJSON pays
- MapLibre
- OpenFreeMap
- photos distantes

## Déployer
### Vercel
Importer le dossier.
Le endpoint `/api/hotels` sera automatiquement disponible.
Ajouter les variables d’environnement Booking dans Settings → Environment Variables.

### Netlify
Le front statique fonctionne.
Le proxy Booking devra être converti en Netlify Function.

## Ce qui reste à connecter pour une production réelle
- Supabase/PostgreSQL
- Auth
- Mondo matching
- messagerie
- vraie météo
- moteur visa officiel et daté
- activités / restaurants
- vols
- Booking Demand API ou Expedia Rapid
- protocole Atlas Verified
- analytics + consentement
- CMS pour blogs
- SEO dynamique par destination
- modération communauté

## Règles produit verrouillées
- Never ask twice.
- Atlas cheap = prix minimum réel.
- Atlas Verified ne peut pas être acheté.
- Un quartier est recommandé en fonction du style de séjour.
- Blog et préparation vivent dans le même hub.
- Une carte doit expliquer une décision.


# MONDO NAVIGATOR — nouvelle fonctionnalité

Une nouvelle route `#navigator` transforme la création de voyage en exploration cartographique.

Fonctions :
- cliquer sur la carte pour ajouter un point,
- déplacer les étapes par drag,
- supprimer un point en un clic,
- route visuelle,
- distance approximative entre chaque étape,
- moyens de transport possibles : marche, vélo, voiture, bus, stop, avion,
- recommandations de villes et lieux au survol,
- durée idéale et mini-description,
- mode Organisateur / Futur participant,
- le participant propose un changement sans modifier le trajet,
- l’organisateur approuve ou refuse,
- demande pour rejoindre avec message de présentation,
- acceptation/refus par l’organisateur,
- messagerie de groupe,
- exemple préchargé : voyage de 14 jours en Albanie.

Les distances affichées sont actuellement des estimations géographiques (Haversine × coefficient route), pas un calcul d’itinéraire routier. Pour la production, brancher un moteur de directions (Mapbox Directions, OpenRouteService, GraphHopper ou équivalent) permettra d’obtenir distance, durée, route réelle et contraintes par mode.
