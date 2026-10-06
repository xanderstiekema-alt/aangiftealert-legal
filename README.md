# AangifteAlert: privacy en gebruiksvoorwaarden

Statische publicatiesite, opgesteld op basis van appversie 1.0.0 op 6 oktober 2026. Geen buildstap, JavaScript, cookies, analytics, formulieren of externe lettertypen.

## Publicatie op GitHub Pages

Publiceer uitsluitend de inhoud van deze map in de aparte openbare repository `aangiftealert-legal`. Selecteer bij Settings → Pages: Deploy from a branch, `main`, `/ (root)`. `.nojekyll` schakelt Jekyll-verwerking uit. Alle interne links zijn relatief en werken onder de repository-subdirectory.

Verwachte URLs na publicatie:

- https://xanderstiekema-alt.github.io/aangiftealert-legal/privacy/
- https://xanderstiekema-alt.github.io/aangiftealert-legal/terms/

De appbroncode en overige projectbestanden horen niet in deze openbare repository. Deze map is de lokale bron; wijzigingen moeten ook naar de publicatierepository worden overgebracht.

## Onderbouwing

Gecontroleerd in `src/types/app.ts`, `src/store/app-store.tsx`, `src/services/install-storage.native.ts`, `src/services/calendar.ts`, `src/services/notifications.ts`, `src/app/privacy.tsx`, `app.json`, `package.json`, `README.md` en `app-store-concept.json`. Naam en contactadres zijn overgenomen uit de bestaande App Store-conceptgegevens.

Geraadpleegde primaire bronnen:

- [Autoriteit Persoonsgegevens: recht op informatie](https://autoriteitpersoonsgegevens.nl/nl/zelf-doen/privacyrechten/recht-op-informatie)
- [Autoriteit Persoonsgegevens: bewaren van persoonsgegevens](https://autoriteitpersoonsgegevens.nl/nl/over-privacy/persoonsgegevens/bewaren-van-persoonsgegevens)
- [Expo: privacybeleid](https://expo.dev/privacy)
- [GitHub: privacyverklaring](https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement)
- [Apple: standaard-EULA](https://www.apple.com/legal/internet-services/itunes/dev/stdeula/)
- [GitHub: Pages-publicatiebron instellen](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)

De teksten beschrijven de aangetroffen implementatie en vervangen geen afzonderlijk ingestelde App Store-EULA. Herzie ze bij wijzigingen in gegevensverwerking, aanbiedersgegevens of functionaliteit.
