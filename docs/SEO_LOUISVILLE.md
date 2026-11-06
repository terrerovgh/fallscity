# SEO foundation: Falls City Dev Studio (Louisville, KY)

Status as of 2026-11-06. This file is the working record for search work on `https://fallscity.dev`: what was found, what was changed, how it was verified, and what still needs the owner. Update it when the facts change, and do not record anything here that has not been verified.

No one can guarantee rankings. The goal is a site that Google can crawl, understand, and trust, and that turns qualified Louisville visitors into project inquiries.

---

## 1. Executive audit

### What was verified, and how

| Area | Method | Result |
|---|---|---|
| Live site | `curl` to apex and `www`, HTTP and HTTPS; DNS-over-HTTPS lookup | **Not live.** `fallscity.dev` is delegated to Cloudflare (`janet`/`simon.ns.cloudflare.com`) but has **no A/AAAA record**, and `www` does not resolve. Nothing about redirects, TLS, headers, or Googlebot rendering on production could be tested. |
| Source and build | Read every page, component, and config file; `npm run check`; `npm run build`; inspected `dist/` | Astro 7.4.6, static output, `trailingSlash: 'always'`, `@astrojs/sitemap`, Cloudflare Pages Function for the form. The build was clean before any changes. |
| Rendered HTML | `scripts/seo-audit.mjs` over `dist/`, plus manual inspection | All content and links are server-rendered HTML. JavaScript drives only the nav toggle, form enhancement, and 3D logo. |
| Lab performance and accessibility | Lighthouse 12.8.2, mobile preset, headless Chromium, local static server | See section 4. These are **lab** numbers. There is no field (CrUX/Search Console) data because the site is not live. |

### Findings by severity

**P0: blocks launch or conversions (owner action required)**

1. **The site is not deployed.** No DNS record points at a host. Until it is live, nothing can be indexed. (README: deployment needs explicit owner authorization.)
2. **There is no working way to contact the studio.** Every CTA leads to `/contact/`, where the form is intentionally disabled until Turnstile and Resend are configured, and no email or phone is published. Organic visitors could not convert. Fix this by configuring the form (README §Inquiry form) and/or publishing an owner-approved email address.
3. **The privacy notice is a visible draft** that says it needs owner and legal review. It is now `noindex` and out of the sitemap until it is finalized (see the ledger).

**P1: fixed in code (this pass)**

4. **One services URL for four intents.** Maintenance, SEO foundations, and core design/redesign all competed on `/services/`, which uses fragment anchors that Google does not index separately. There are now dedicated pages for the three services with distinct search intent.
5. **FAQPage structured data** on `/` and `/services/`. Google removed FAQ rich results from Search on 2026-05-07 (Search Central changelog). The markup gave no benefit, so it was removed. The visible FAQs stay.
6. **Organization and WebSite JSON-LD repeated on every page.** Google recommends placing Organization on the homepage or one about page. They are now on the homepage only. Other pages reference them by stable `@id`.
7. **The 404 page declared a canonical** (`/404.html`) while being `noindex`. The canonical, `og:url`, and JSON-LD were removed from `noindex` pages.
8. **The 3D hero logo blocked the main thread on GPU-less devices.** With software WebGL (SwiftShader), Lighthouse measured **TBT 2,810 ms** on the homepage, and default headless runs failed with "page stopped responding". Software renderers now get the existing static poster (the 3D scene is unchanged on real GPUs).
9. **No breadcrumbs, and thin internal linking between services.** Visible breadcrumbs, BreadcrumbList markup, a footer Services column, and descriptive contextual links were added.
10. **`*.pages.dev` deployments could be indexed** once Cloudflare Pages is connected. `public/_headers` now sends `X-Robots-Tag: noindex` on those hostnames.

**P2: future opportunities (not done; see roadmap)**

11. No Louisville clients in the portfolio yet. Current work is in New Mexico and South Georgia, plus personal and open-source projects. This is the biggest gap against local competitors.
12. The About page has no named person, credentials, or photo. The owner must supply these; they will not be invented.
13. There are no educational guides. Topics are planned in §6 but not published, because they need the owner's first-hand input.
14. Measurement: no Search Console, no analytics, no baseline (§5).
15. LCP on mobile lab runs is about 1.9–2.3 s. The LCP element is the header logo SVG, behind ~38 KB of render-blocking CSS. That passes the 2.5 s threshold. Inlining all CSS would trade away caching, so it was left as is.

### Things that are already right (kept)

- Truthful copy with clear scope limits, including an explicit "no guaranteed rankings" statement.
- `lang="en-US"`, one H1 per page, semantic sections, skip link, keyboard nav, reduced-motion support.
- A valid 1200×630 social card, `robots.txt` with a sitemap directive, and a sitemap with the correct origin.
- Self-hosted fonts, responsive AVIF/WebP portfolio images with explicit dimensions and lazy loading.

---

## 2. Keyword and intent map

**How this was researched.** Web searches were run on 2026-11-06 through a US search API, not a logged-in Google SERP. Results vary by location and personalization. **No search volumes, difficulty scores, or rankings were measured**, and none are claimed. Validate everything below with Search Console impressions after launch.

### What the results showed (observed)

- `web design Louisville KY`, `small business website design Louisville`, `website developer Louisville KY`: a mix of **dedicated city landing pages** from agencies (e.g. CyberOptik `/web-design/louisville-ky/`, Big Drop `/web-design-agency-louisville/`, JFWeb `/pages/louisville-ky/`), **directories** (DesignRush, Clutch, Semrush Agency Partners, GoodFirms), and **programmatic neighborhood pages** from an out-of-state agency (dozens of `/louisville-ky/<neighborhood>/web-design` URLs). Same-name results for Louisville, Colorado also appear.
- `website maintenance Louisville KY`: one local agency page with a dedicated maintenance URL, then directories (Semrush, BBB). Thin competition.
- `how much does a small business website cost Louisville`: local designers' pricing guides and directories. The figures quoted are vendor marketing, not market data.
- `website redesign checklist`: national agency and host blogs. Little local intent.

**What competitors emphasize:** years in business, named clients, review counts, pricing ranges, WordPress, and bundled "SEO + Google Business Profile" monthly plans.

**Gaps Falls City can fill honestly:**
- Plain-English scope: what is and is not included.
- An explicit no-guarantee SEO stance.
- Documented accounts and ownership.
- Real, linkable live work.
- A genuinely local studio, compared with out-of-state programmatic pages.

### Map

| Cluster (seed terms) | Intent / stage | Target URL | Confidence |
|---|---|---|---|
| web design Louisville KY · web designer Louisville KY · website design Louisville · web development company Louisville | Commercial, choosing a provider | `/` | Medium. This is the head term, and the homepage will collect most links. Directories dominate, and a new domain will need authority. |
| small business website design Louisville · small business website developer Louisville · business website design Louisville · website redesign Louisville | Commercial investigation: what do I get? | `/services/web-design/` | Medium. Distinct from `/` through deliverables and redesign content. Watch for query splitting with `/` in Search Console (§7). |
| website maintenance Louisville KY · website hosting and maintenance Louisville | Commercial, existing site owners | `/services/website-maintenance/` | Medium–high. Fewer strong local pages were observed. |
| technical SEO for small business Louisville · SEO setup for a new website | Commercial, narrowly scoped | `/services/seo-foundations/` | Low–medium. Most "Louisville SEO" searchers want ongoing agency SEO, which the studio does not sell. The page says so plainly. |
| website services Louisville · domain, hosting and SSL setup | Navigational/overview | `/services/` (hub; hosting lives at `#domains-hosting-ssl`) | Low. Hosting/SSL alone is not worth a separate thin page yet. |
| web design process · how a website project works | Consideration | `/process/` | Low (supporting page). |
| Falls City Dev Studio · fallscity.dev | Branded | `/`, `/about/` | High once live. Note the noisy "Falls City" namespace (§7). |
| how much does a small business website cost in Louisville | Informational → commercial | Answered briefly on `/services/web-design/` (FAQ). A full guide is planned. | Low. No published prices, so the page explains cost drivers only. |
| what a Louisville small business website should include · website redesign checklist · web designer vs website builder | Informational | Planned guides (§6). Not published. | — |

**Cannibalization rules:**
- Only `/` uses "Web Design in Louisville, KY" as its title lead.
- `/services/web-design/` leads with "Small Business Website Design" and owns the redesign content.
- No neighborhood, ZIP, or nearby-city pages. Add one only with substantial, distinct content and real work there.

---

## 3. Implementation ledger

| File | Change | URLs affected |
|---|---|---|
| `src/lib/seo.ts` (new) | Stable `@id`s, `absoluteUrl`, Louisville `areaServed`, `serviceNode()` helper, `Crumb`/`PageType` types | all |
| `src/components/SEO.astro` | Organization and WebSite on `/` only. A `WebPage`/`AboutPage`/`ContactPage`/`CollectionPage` node per page. BreadcrumbList. `noindex` pages get no canonical, `og:url`, or JSON-LD. `robots` set to `index, follow, max-image-preview:large`. `twitter:image:alt`. Logo as an `ImageObject` with dimensions. | all |
| `src/components/Breadcrumbs.astro` (new), `PageHero.astro`, `src/layouts/BaseLayout.astro`, `src/styles/global.css` (`.breadcrumbs`, 4-column footer) | Visible breadcrumbs. `pageType`/`breadcrumbs` props passed through. | all except `/` and 404 |
| `src/pages/services.astro` → `src/pages/services/index.astro` | Same URL. Hub page: new title and description, stable `id`s from data, descriptive links to the new pages, FAQPage removed, a Service node only for Domains/Hosting/SSL | `/services/` |
| `src/pages/services/web-design.astro` (new) | Core service page: includes, new site vs redesign, process, related services, cost-driver FAQ (no prices) | `/services/web-design/` |
| `src/pages/services/website-maintenance.astro` (new) | Maintenance scope, what is agreed up front, why maintenance matters | `/services/website-maintenance/` |
| `src/pages/services/seo-foundations.astro` (new) | Six foundations, included vs not included, local search explained honestly (Business Profile is separate) | `/services/seo-foundations/` |
| `src/data/services.ts` | Added `anchor`, `href`, `linkLabel` | cards on `/`, `/services/`, footer |
| `src/components/ServiceCard.astro` | Links to dedicated pages instead of `/services/#…` | `/` |
| `src/components/SiteFooter.astro` | Services column | all |
| `src/pages/index.astro` | Title **"Web Design in Louisville, KY \| Falls City Dev Studio"**. New description. Eyebrow "Web design · Louisville, Kentucky". Contextual links to the three service pages. Service and FAQPage JSON-LD removed. | `/` |
| `about.astro`, `contact.astro`, `process.astro` | Breadcrumbs and page types. Contact title "Request a Website Quote in Louisville". | `/about/`, `/contact/`, `/process/` |
| `src/pages/privacy.astro`, `src/config/site.ts` (`privacyIsDraft`), `astro.config.mjs` (sitemap filter) | Draft privacy notice set to `noindex` and excluded from the sitemap. Flip both when it is finalized. | `/privacy/` |
| `src/pages/404.astro` | No canonical | 404 |
| `src/components/HeroArtwork.astro` | Skip the 3D scene on software WebGL (SwiftShader/llvmpipe, etc.) and keep the static poster | `/` |
| `public/_headers` (new) | `X-Robots-Tag: noindex` on `*.pages.dev` and previews. `nosniff`. `strict-origin-when-cross-origin`. One-year immutable cache for `/_astro/*`. | all (Cloudflare Pages only) |
| `scripts/seo-audit.mjs` (new), `package.json` (`audit:seo`, `test`) | Automated checks (§4) | — |

### Final titles and descriptions

| URL | Title | Description (summary) |
|---|---|---|
| `/` | Web Design in Louisville, KY \| Falls City Dev Studio | Custom websites for Louisville small businesses and independent professionals; lists all services |
| `/services/` | Website Services for Louisville Businesses \| Falls City Dev Studio | The four services and what each covers |
| `/services/web-design/` | Small Business Website Design in Louisville \| Falls City Dev Studio | New sites and redesigns, mobile-first and accessible, with SEO foundations |
| `/services/website-maintenance/` | Website Maintenance in Louisville, KY \| Falls City Dev Studio | Agreed updates, fixes, checks, and support, with the scope set up front |
| `/services/seo-foundations/` | Small Business SEO Foundations in Louisville \| Falls City Dev Studio | Technical and on-page groundwork, with no ranking guarantees |
| `/process/` | Our Website Design Process \| Falls City Dev Studio | unchanged |
| `/about/` | About Our Louisville Web Studio \| Falls City Dev Studio | unchanged |
| `/contact/` | Request a Website Quote in Louisville \| Falls City Dev Studio | lightly edited |

**Copy note for owner review:** The new pages reuse the approved service, process, and FAQ text and add general, verifiable web practice. Two statements are new commitments, so please confirm them:
- A redesign reviews existing pages and addresses and redirects moved URLs.
- Maintenance terms define how requests are sent and how out-of-scope work is quoted.

---

## 4. Validation

All commands were run on 2026-11-06 with Node 26.12.0 and Chromium 1208 (headless).

| Command | Result |
|---|---|
| `npm run check` | 0 errors, 0 warnings, 0 hints (36 files) |
| `npm run build` | 10 pages built (8 indexable + `/privacy/` noindex + `404.html`) |
| `npm run audit:seo` | **Before** (original build): 2 errors (FAQPage on `/` and `/services/`), 1 warning (canonical on noindex 404). **After:** 0 errors, 0 warnings. |
| `npm test` | Runs all three in sequence |
| Audit self-test | A copy of `dist/` seeded with a duplicate title, broken link, missing fragment, missing trailing slash, and a noindex page left in the sitemap. All 5 were reported and the exit code was 1. |
| Schema.org validator (`validator.schema.org`, POST of built HTML) | All 8 indexable pages: **0 errors, 0 warnings**. Types: Organization, WebSite, WebPage, CollectionPage, AboutPage, ContactPage, Service, BreadcrumbList. |

**What the audit script checks:**
- `lang`, title, meta description, and exactly one H1.
- Unique titles and descriptions.
- Absolute self-canonical and `og:url` on indexable pages; no canonical on noindex pages.
- Absolute `og:image` that exists.
- JSON-LD parses, uses `@id`s on the production origin, and contains no unverified properties (`telephone`, `address`, `geo`, `openingHours`, `review`, `aggregateRating`, `FAQPage`).
- Every `<img>` has `alt`.
- Internal links resolve, use trailing slashes, and fragment targets exist.
- The sitemap lists exactly the indexable, self-canonical pages.
- `robots.txt` has the Sitemap directive and no site-wide Disallow.
- The 404 page exists and is noindex.

### Lighthouse 12.8.2 (mobile, simulated throttling, local server: lab data)

| Page | Perf | A11y | BP | SEO | LCP | CLS | TBT |
|---|---|---|---|---|---|---|---|
| `/` before, default headless (software WebGL) | — | — | — | — | run failed: "page stopped responding" | | |
| `/` before, SwiftShader forced | 67 | 100 | 100 | 100 | 2.3 s | 0 | **2,810 ms** |
| `/` before, WebGL disabled | 97 | 100 | 100 | 100 | 2.3 s | 0 | 0 ms |
| `/` after (default headless) | 97 | 100 | 100 | 100 | 2.3 s | 0 | 0 ms |
| `/services/` before | 99 | 100 | 100 | 100 | 2.0 s | 0 | 0 ms |
| `/services/` after | 99 | 100 | 100 | 100 | 2.0 s | 0 | 0 ms |
| `/services/web-design/` (new) | 99 | 100 | 100 | 100 | 1.9 s | 0 | 0 ms |
| `/services/website-maintenance/` (new) | 99 | 100 | 100 | 100 | 1.9 s | 0.022 | 0 ms |
| `/services/seo-foundations/` (new) | 99 | 100 | 100 | 100 | 1.7 s | 0.022 | 0 ms |
| `/about/` | 99 | 100 | 100 | 100 | 1.8 s | 0 | 0 ms |
| `/contact/` | 99 | 100 | 100 | 100 | 1.8 s | 0.027 | 0 ms |
| `/process/` | 99 | 100 | 100 | 100 | 1.8 s | 0.022 | 0 ms |
| `/privacy/` (now noindex) | 99 | 100 | 100 | 66* | 1.8 s | 0 | 0 ms |

\* Expected: Lighthouse marks the deliberate `noindex` as "page is blocked from indexing".

Not measured: real-GPU behavior of the 3D scene (unchanged code path), field Core Web Vitals (no CrUX data before launch), and the Google Rich Results Test (no public API; run it after launch, §5).

**Visual check:** `/services/web-design/` at 390 px and 1440 px. Breadcrumbs wrap correctly, there is no horizontal overflow, the 4-column footer collapses to 2 columns on mobile, and the active nav state shows on Services.

**Not verifiable before deployment:** HTTPS/HSTS, the `www`→apex redirect, trailing-slash redirects (Cloudflare Pages serves `/about` → `/about/` with a 308), 404 status codes, `_headers` behavior, and form delivery. Run the post-launch commands in §5.

---

## 5. Owner action checklist

### Launch (P0)

- [ ] **Authorize deployment** to Cloudflare Pages (README §Deployment). Connect `fallscity.dev` as a custom domain.
- [ ] **Make inquiries work:** configure Turnstile and Resend and send a real test inquiry, and/or publish a monitored business email. Without one of these, organic traffic cannot convert.
- [ ] **Finalize the privacy notice**, then set `privacyIsDraft = false` in `src/config/site.ts` and remove `/privacy/` from `excludedFromSitemap` in `astro.config.mjs`.
- [ ] **`www` redirect:** add a proxied DNS record for `www` and a Cloudflare Redirect Rule: `http.host eq "www.fallscity.dev"` → `concat("https://fallscity.dev", http.request.uri.path)`, status 301, preserve query string. Enable "Always Use HTTPS". (`.dev` is HSTS-preloaded, so browsers will not use HTTP anyway.)
- [ ] Optional: redirect `<project>.pages.dev` to `https://fallscity.dev` with a Bulk Redirect. `_headers` already marks it `noindex`.

**Post-launch verification commands:**

```sh
for u in https://fallscity.dev/ https://www.fallscity.dev/ http://fallscity.dev/ https://fallscity.dev/about https://fallscity.dev/nope/; do
  curl -sS -o /dev/null -w "%{http_code} %{redirect_url}  $u\n" "$u"; done
# expect 200; 301 → apex; 301/308 → https; 308 → /about/; 404
curl -sI https://fallscity.dev/_astro/<any-file> | grep -i cache-control   # immutable
curl -sI https://<project>.pages.dev/ | grep -i x-robots-tag               # noindex
curl -s https://fallscity.dev/robots.txt; curl -s https://fallscity.dev/sitemap-0.xml
npx lighthouse https://fallscity.dev/ --preset=perf   # lab check on production
```

### Google Search Console (owner account)

1. Add a **Domain property** for `fallscity.dev` and verify with the DNS TXT record in Cloudflare DNS. This covers all hosts and protocols.
2. Submit the sitemap: **`https://fallscity.dev/sitemap-index.xml`**.
3. Run URL Inspection → Request indexing for `/`, `/services/web-design/`, `/services/website-maintenance/`, `/services/seo-foundations/`, and `/services/`.
4. Paste a page URL into the [Rich Results Test](https://search.google.com/test/rich-results) to confirm Breadcrumb and Organization parsing.
5. Optional: in Bing Webmaster Tools, import the site from Search Console.

Submitting a sitemap or requesting indexing does **not** guarantee crawling, indexing, or rankings.

### Analytics (decision needed)

No analytics are installed, and the privacy notice says so. To measure traffic beyond Search Console, the owner must pick a tool and own the account. A cookieless option such as Cloudflare Web Analytics fits the current privacy notice best. Any tool requires updating the privacy notice first. Do not add tags without that decision.

### Google Business Profile: eligibility check (do not create a profile until every item is "yes")

Google's guidelines (support.google.com/business/answer/3038177): a business qualifies if it "has a physical location that customers can visit, or travels to customers where they are". Virtual offices and remote mailboxes are not eligible.

- [ ] Does the studio **meet clients in person** in the Louisville area, at their business or at a staffed studio location, during stated hours? If all work is remote, the business is **not eligible**. Stop here.
- [ ] If it travels to clients and has no staffed customer-facing office, set it up as a **service-area business** with the address **hidden**, and a service area of cities or ZIPs no more than about 2 hours' drive from the base.
- [ ] Business name exactly "Falls City Dev Studio", with no keywords or city added.
- [ ] A phone number and hours you will actually answer.
- [ ] If eligible: primary category "Website designer" (confirm in the category picker). Services matching the website. Website `https://fallscity.dev/`. Real photos of work. Ask actual clients for reviews; never incentivize or fake them.

### Verified business-information sheet (use it identically everywhere)

| Field | Value |
|---|---|
| Business name | Falls City Dev Studio |
| Website | https://fallscity.dev/ |
| Logo | https://fallscity.dev/brand/fallscity-logo.png (1200×301) |
| Short description | Professional website design, development, SEO foundations, and ongoing care for Louisville small businesses. |
| Services | Website design & development · SEO foundations · Domain, hosting & SSL setup · Website maintenance |
| Market / service area | Louisville, Kentucky (exact service area: REQUIRES_OWNER_INPUT) |
| Business model (storefront / service-area / online-only) | REQUIRES_OWNER_INPUT |
| Public street address | REQUIRES_OWNER_INPUT (do not publish a home address) |
| Public phone | REQUIRES_OWNER_INPUT |
| Public email | REQUIRES_OWNER_INPUT |
| Hours | REQUIRES_OWNER_INPUT |
| Legal entity / registration | REQUIRES_OWNER_INPUT |
| Founding date | REQUIRES_OWNER_INPUT |
| Owner / principal name and role (for About) | REQUIRES_OWNER_INPUT |
| Social profiles | REQUIRES_OWNER_INPUT (none known) |

Once a field is verified, it can go into the Organization JSON-LD (`src/components/SEO.astro`): `email`, `telephone`, `sameAs`, `founder`, `foundingDate`. Use `address` only if the address is public. Update the banned list in `scripts/seo-audit.mjs` deliberately when you do.

### Local citations and authority (legitimate only)

| Opportunity | Requires | Notes |
|---|---|---|
| Google Business Profile | Eligibility above | The biggest local lever if eligible |
| Bing Places | Same facts as GBP | Can import from GBP |
| Apple Business Connect | Same facts | Free |
| Louisville Independent Business Alliance (LIBA) | Locally owned independent business; membership fee | Verify current terms |
| Greater Louisville Inc. (metro chamber) | Paid membership | Member directory and events |
| BBB (Louisville) | Free listing; accreditation is paid | Optional |
| Clutch / DesignRush / UpCity profiles | Free profiles; reviews need real clients | These directories rank for the head terms, so a truthful profile can capture referral clicks |
| Client credit links | Client permission | Ask clients whose sites you built for a "Website by Falls City Dev Studio" footer credit |
| Local community | Real participation | Louisville tech meetups, the Kentucky SBDC, and library or small-business workshops: talks or volunteer help that might naturally earn a mention |

Never buy links, use bulk-citation services or spam directories, or solicit fake reviews.

---

## 6. 30/60/90-day roadmap

Dependencies first: nothing below starts until the site is live and inquiries work.

**Days 0–30: launch and baseline**
- Deploy, set up the redirects, run the §5 verification commands, verify Search Console, submit the sitemap, and request indexing.
- Configure the form or publish an email address. Send a real test inquiry.
- Finalize privacy, and decide on analytics.
- Owner supplies About details: a named principal, background, and a photo (optional). Add them to `/about/` and to Organization `founder`.
- Run the GBP eligibility check, and create the profile only if eligible.
- **KPIs:** pages indexed (Page indexing report) = 8 of 8; zero coverage errors; first non-branded impressions recorded.

**Days 31–60: credibility and first guide**
- Land the first Louisville client, or a documented Louisville project, and add it to the portfolio. Include a case write-up only with client approval and real facts.
- Publish **one** guide from the editorial calendar below, written with the owner's real process and examples.
- Create directory profiles (Clutch, Bing Places, and so on) using the information sheet, exactly as written.
- **KPIs:** non-branded impressions trend for the target clusters; CTR by page; inquiries per month (count manually from email).

**Days 61–90: refine from data**
- In Search Console, filter queries with the regex `louisville|\bky\b|kentucky` and exclude branded queries (below). Find pages with impressions but low CTR and rewrite their titles and descriptions. Find queries landing on the wrong URL and adjust internal links or copy.
- If `/` and `/services/web-design/` both get impressions for "web design louisville" variants, decide which owns the term and differentiate the other.
- Second guide only if the first shows impressions.
- **KPIs:** clicks and average position for each cluster, compared over equal 28-day windows; organic inquiries; qualified inquiries (fit by service and budget).

**Branded vs non-branded:** "Falls City" is shared with other Louisville businesses (Falls City Beer and others). Treat as branded only `falls city dev|fallscity` (Search Console → Query → Custom regex). Everything else is non-branded, including generic "falls city" queries.

### Editorial calendar (proposed; nothing is published yet)

| Priority | Working title | Target intent | Owner input needed |
|---|---|---|---|
| 1 | What a Louisville small business website needs (first site edition) | Informational → `/services/web-design/` | Real page structures from past projects and screenshots |
| 2 | Domain, hosting, and SSL: what your business should own | Informational → `/services/#domains-hosting-ssl` | The studio's actual account and ownership policy |
| 3 | Website redesign checklist for local service businesses | Informational → `/services/web-design/` | Real redirect and content-audit examples |
| 4 | What "SEO foundations" means on a new website | Informational → `/services/seo-foundations/` | Before/after audit output from a real build (with permission) |
| 5 | How to prepare content for a website project | Consideration → `/process/` | The studio's actual intake questions |

Publish each guide under `/guides/<slug>/`, with a real publication date, a named author, and a link from the related service page. Skip any topic the owner cannot add first-hand substance to.

---

## 7. Risks and open questions

- **Rankings are uncertain.** This is a new domain with no links and no reviews, competing against established agencies, directories, and programmatic pages. Expect months, not weeks, and possibly no head-term visibility without local proof (clients, reviews, links).
- **Eligibility for local map results is unknown.** If the studio does not meet clients in person, it is not eligible for a Business Profile, and the map pack is out of reach. Organic pages are then the whole local strategy.
- **Missing real-world facts:** owner identity, contact details, service area, and business registration. These limit trust signals, and they will not be invented.
- **Portfolio locality:** no Louisville work is shown yet. The copy never claims Louisville clients, and that must stay true.
- **Possible cannibalization** between `/` and `/services/web-design/`. Monitor it (60–90 days).
- **Brand namespace:** "Falls City" is crowded locally, and a federal FALLS CITY mark exists in other classes (see `deep-research-report.md`). Branded search data will be noisy, and a trademark review is the owner's decision.
- **Lab vs field:** all performance numbers here are Lighthouse lab runs. Judge Core Web Vitals from Search Console and CrUX after real traffic arrives (75th percentile: LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1).
