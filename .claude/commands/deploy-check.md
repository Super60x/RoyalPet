# Deploy Check — RoyalPet.app

Controleer het project voordat het naar Vercel gepusht wordt.

## Checks uitvoeren

### Build
- [ ] `npm run build` — moet slagen zonder errors

### TypeScript
- [ ] `npx tsc --noEmit` — geen type errors

### Secrets
- [ ] `.env.local` staat in `.gitignore`
- [ ] Grep op hardcoded keys: zoek naar patronen als `sk_`, `pk_`, `sbp_`, `re_` in src/
- [ ] Geen API keys in client-side code (behalve `NEXT_PUBLIC_` variabelen)

### SEO & Performance
- [ ] Alle pagina's hebben `<title>` en `<meta description>`
- [ ] Afbeeldingen gebruiken Next.js `<Image>` component
- [ ] Geen `console.log` in productie code

### Stripe
- [ ] Webhook endpoint URL klopt voor productie
- [ ] Correcte payment_method_types: ideal, bancontact, card

Geef een pass/fail rapport per check. Stop bij kritieke failures.
