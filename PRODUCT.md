# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Retail customers of LM, a real Brazilian store, browsing its inventory of furniture, lighting, and decor. They shop in Portuguese (pt-BR), evaluate pieces online, and act by starting a WhatsApp conversation or visiting the physical store. Secondary users: store staff who manage products, categories, and home content through the Payload admin panel at `/admin` without touching code.

## Product Purpose

An online catalog (not e-commerce) for LM's real inventory. Success is a visitor finding a piece they want and starting a WhatsApp conversation about it — or walking into the physical store already knowing what they came for. There is deliberately no cart or checkout.

## Positioning

Curated, piece-by-piece selection with personal service: the incumbent home copy ("Peças que dão caráter ao ambiente… selecionados peça a peça") frames the store as a curator, not a warehouse. The sale happens in a human conversation (WhatsApp / in store), and the catalog's job is to start that conversation with the right piece.

## Operating Context

- Brazilian retail; all UI, admin labels, and domain vocabulary in pt-BR; prices in BRL.
- A product without a price legitimately displays "sob consulta" — a first-class state, not missing data.
- The store has a physical showroom customers visit, plus WhatsApp selling. Address, hours, and the WhatsApp number are not yet on hand (see Evidence).
- Staff workflow: create categories, register products (photos, specs, tags, rich-text details), toggle `destaque` (featured) and `ativo` (visible) flags, and edit home hero content — all in the Payload admin.
- Surfaces in production shape: home (hero + one section per highlighted category), `/catalogo` (grid with typo-tolerant client-side search via Fuse.js and category filter), `/catalogo/[slug]` (gallery, price, specs table, details, related products).

## Capabilities and Constraints

- Stack: Payload CMS 3 + Next.js 16 (App Router) + Postgres + Tailwind v4. Client-side Fuse.js search is the confirmed approach up to roughly 2,000 products; beyond that, `Init.md` records the planned migration paths (plugin-search or Meilisearch/Typesense).
- Media storage must move to S3/R2 before production deploy (server disk is ephemeral) — recorded in `Init.md`, not yet done.
- Postgres migrations are versioned in `src/migrations` and must run at build time in production.
- **Undecided product facts (do not invent):**
  - WhatsApp number and contact flow details — no contact mechanism exists in the code yet.
  - Physical store address and hours.
  - How the LM sub-brands relate to this catalog: LM operates Brazilian sub-brands **LM Vidros**, **LM Construções**, and **LM Esquadrias** (spellings normalized from the owner's message; confirm official forms), yet the current inventory is furniture/lighting/decor. Whether this catalog serves one sub-brand, a separate home/decor line, or the LM umbrella is unconfirmed.

## Brand Commitments

- The brand is **LM** — a real Brazilian brand family with sub-brands LM Vidros, LM Construções, and LM Esquadrias. The header's current "Catálogo" label is a placeholder, not a commitment.
- No logo or identity assets are in the repo yet; obtain them from the client rather than inventing marks.
- Existing product and admin copy is warm, direct pt-BR (e.g. admin field descriptions written for a non-technical store owner); preserve that register.

## Evidence on Hand

- Real product photography of actual inventory in `/media` (brass table lamps, nordic upholstered chairs, modular shelving, and more), confirmed genuine by the owner — with generated 400×400 and 800×800 sizes.
- Real product data lives in the Payload/Postgres database, not in the repo.
- **Absent — must not be fabricated:** WhatsApp number, store address/hours, testimonials, customer names, delivery/warranty claims, and any sub-brand logos.

## Product Principles

1. **The catalog sells a conversation, not a checkout.** Every product surface should resolve toward a WhatsApp conversation or a store visit; never simulate e-commerce mechanics the store doesn't have.
2. **Real inventory only.** Show confirmed products, real photos, and true prices; "sob consulta" is presented confidently, never as an error or gap.
3. **Findability is the core utility.** Typo-tolerant search, category browsing, and tags are what make the catalog worth using; they outrank expression on catalog surfaces.
4. **Staff own the content.** Anything customer-facing that changes often (products, categories, home hero) must stay editable in the admin panel without code changes.
5. **Portuguese-first.** pt-BR is the product language across UI, admin, and domain vocabulary (Produtos, Categorias, destaque, ativo, sob consulta).
