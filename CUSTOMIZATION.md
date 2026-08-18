# Customization Guide

Use this guide when adapting Quiet Pages for a real publication. [README.md](./README.md) covers installation and the shape of the project; this document covers what to change, where, and what depends on it.

## Site Settings

Edit [src/config/theme.config.ts](./src/config/theme.config.ts) first. It is the theme's single source of truth for site metadata, navigation, contact details, form endpoints, social links, authors, categories, and tags. Almost nothing in the theme hardcodes these — components read them through [src/lib/blog-data.js](./src/lib/blog-data.js), which re-exports the config alongside the post query helpers.

`SITE` carries the name, description, locale, language, and repository URL. The name fills the header wordmark, the footer, every page title suffix, and the RSS channel; the description is the default meta description and the footer standfirst.

`NAVIGATION` is a flat array that fills both the desktop nav and the mobile sheet. Entries can be added or reordered freely. A link is marked current when the path starts with its `to` value, so `/blog` also highlights while reading a post — the one exception is `/`, which is matched exactly.

`CONTACT` holds the public email and social handle used by the contact page and the footer social row. `SOCIAL_LINKS` is the footer row itself; each entry's `icon` must resolve in [src/components/Icon.astro](./src/components/Icon.astro) — see [Icons](#icons).

### Production URL

Set the production domain before building:

```bash
SITE_URL=https://your-domain.com npm run build
```

`PUBLIC_SITE_URL` works too. **Set it in the shell or in your host's environment variables, not only in a `.env` file.** The two consumers read it from different places: [astro.config.mjs](./astro.config.mjs) reads `process.env`, which a `.env` file does not populate, while [src/config/theme.config.ts](./src/config/theme.config.ts) reads `import.meta.env`, which it does. Configure only a `.env` file and you get a build where the sitemap, robots, and RSS point at your domain while canonical and Open Graph URLs still point at the fallback — the worst of both. If you would rather not depend on the environment at all, replace the fallback string in both files with your domain.

## Authors

Authors live in the `authors` array in [src/config/theme.config.ts](./src/config/theme.config.ts). Each entry needs a `slug`, `name`, `bio`, `longBio`, and `avatar`:

- `slug` is what a post's `author` frontmatter refers to, and it becomes `/authors/<slug>`.
- `bio` is the one-liner under the author card at the foot of an article and in the sidebar.
- `longBio` is the standfirst on the author page.
- `avatar` is a path under `public/`. The bundled files are initials-based SVGs in [public/avatars](./public/avatars) — replace them with photographs and keep them square, since they are rendered as circles at 28px, 40px, 56px, and 96px.

An `author` value with no matching entry is not a build error: the byline, the author card, and the avatar are simply skipped, and the post still publishes. That keeps a renamed author from breaking a build, but it also means a typo fails quietly — check an article page after renaming a slug.

`authors[0]` has a second job: [src/components/Sidebar.astro](./src/components/Sidebar.astro) uses it as the masthead editor. Order the array with that in mind, or edit the component to pick a specific slug.

## Categories and Tags

Both live in [src/config/theme.config.ts](./src/config/theme.config.ts) as `{ slug, name }` pairs, and both are authoritative — the config, not the content, decides what exists:

- Routes are generated from the config, so `/categories/<slug>` and `/tags/<slug>` pages exist only for configured entries.
- The archive filter menus, the footer sections list, and the sidebar lists are all built from the config.
- A post whose `category` or `tags` value is not in the config still publishes and is still searchable, but its label falls back to the raw slug and it has no taxonomy page to link to.

So when you add a category or tag to a post, add it to the config in the same commit. When you remove one, check the demo posts still reference only what remains.

Two smaller consequences worth knowing:

- The footer's **Sections** column shows the first five categories, in declared order. Reorder the array to change which five appear.
- [src/pages/sitemap.xml.js](./src/pages/sitemap.xml.js) lists every configured category, tag, and author regardless of whether anything is published under it, so a leftover tag becomes a crawlable, empty page in your sitemap. Prune the config rather than leaving unused entries behind.

## Post Frontmatter

Every post is a folder under [src/content/blog](./src/content/blog) containing `index.mdx` and its images. The schema in [src/content.config.js](./src/content.config.js) validates the frontmatter, and the folder name becomes the slug and the URL, `/blog/<folder>`.

Required: `title`, `excerpt`, `date`, `category`, `tags`, `author`, `thumbnail`, `thumbnailAlt`.

Optional, and worth knowing about:

- `readingTime` overrides the estimate. Left out, it is counted from the MDX body at build time at 220 words per minute, ignoring fenced code blocks and HTML tags — change `wordsPerMinute` in [src/lib/blog-data.js](./src/lib/blog-data.js) to adjust.
- `featured: true` promotes the post to the homepage lead. See [Homepage](#homepage).
- `draft: true` hides the post from every listing, taxonomy page, feed, sitemap, and route.
- `updated` adds an "updated" line to the article byline and drives `dateModified` in the article's JSON-LD and `lastmod` in the sitemap.
- `seoTitle` and `seoDescription` override the `<title>` and meta description without changing the visible headline or standfirst. `canonical` overrides the canonical URL, for a piece first published elsewhere.
- `excerpt` does more work than it looks: it is the standfirst under the headline, the card description, the meta description, the RSS item description, and half of what the archive search matches on. Write it as a sentence, not a keyword list.
- `imageCredit` renders a caption and photo credit under the article's lead image. It takes `author`, `authorUrl`, `sourceUrl`, an optional `caption`, and a `source` that defaults to `Unsplash`. Supply it or omit it entirely — the schema requires the URLs once the object is present.
- `thumbnailAlt` is the alt text for the lead image on the article page. Cards and the homepage render the same image decoratively with empty alt, since the headline beside them already carries the meaning.

## Homepage

[src/pages/index.astro](./src/pages/index.astro) is a page, not a set of configurable blocks — the hero headline and standfirst are written directly in the markup, so edit them there. Three parts are worth knowing about:

**The hero** uses [src/assets/autumn-scene.webp](./src/assets/autumn-scene.webp) as a full-bleed image behind the wordmark, with the header rendered transparent over it. Replace the file, or swap the import for another asset. It is the page's LCP image, so it is loaded eagerly with `fetchpriority="high"` and served through Astro's pipeline at four widths — keep those attributes on whatever replaces it. The transparent-header treatment is driven by `data-home-header` and the rules in [src/styles.css](./src/styles.css); if your replacement image is light, adjust the two gradient overlays in the hero rather than the header rules, since the header borrows its white text from the overlay.

**The featured block** shows the newest post flagged `featured: true`, falling back to the newest post overall — so the slot is never empty on a site that has flagged nothing. Flag more than one and the newest flagged post wins; the rest simply appear in the grid below.

**The Latest grid** lists every post except the featured one, six at a time, with a row of category buttons above it. Those buttons filter client-side, hold no URL state, and are separate from the archive's filters — this is a homepage teaser, not an archive. The cap of six appears twice, as `index >= 6` in the markup and `visible < 6` in the script; change both together, or the button filtering and the initial render will disagree.

## The Archive and Its Filters

[src/pages/blog/index.astro](./src/pages/blog/index.astro) renders every published post as a list, then filters it in the browser. Three controls compose with `AND`: a search field, a **Category** menu, and a **Tag** menu.

The filters are pill dropdowns rather than chip rows, so a publication with dozens of tags keeps a one-row filter bar. Each menu is a native `<details>` element, which is what gives you the toggle, the keyboard behaviour, and the focus handling for free; the page's own script adds the parts the browser does not have — one menu open at a time, close on selection, close on outside click, and close on `Escape` with focus returned to the pill.

Each row carries a count measured against the _other_ active filters, so it reports what selecting it would return rather than a fixed total. A row that would return nothing is dimmed to 45% instead of being removed, so the menu does not change length while it is being used. Options with no published post behind them are dropped at build time, so no row is a dead end.

Every row is a real link to its taxonomy page. Without JavaScript the menus still open and the rows navigate to `/categories/<slug>` or `/tags/<slug>`; with JavaScript the click is intercepted and filters in place. Selecting the active row again clears that filter, and a **Clear filters** button appears while either menu is active.

State lives in the URL as `?q=&cat=&tag=&page=`, pushed with `history.pushState`, so a filtered view is shareable and the browser's Back button walks the filter history. An unrecognised `cat` or `tag` in the URL is ignored rather than producing an empty list. This is also how the header search field works: it is a plain form that submits to `/blog?q=...`.

`pageSize` at the top of the page script sets how many posts the list reveals at a time (5 by default) and what **Load more** adds.

To add a third dimension — by author, say — five things need to line up:

1. Emit the value as a `data-` attribute on the card in [src/components/PostCard.astro](./src/components/PostCard.astro), next to `data-category` and `data-tags`.
2. Add a `<details>` menu whose rows carry `data-filter="author"` and `data-value="<slug>"`, following the two already there.
3. Add an entry to `emptyLabels` in the page script, which supplies the pill's text when nothing is selected.
4. Add the comparison to `matchesState`, which is the one place filtering is decided — the counts, the empty state, and the pagination all run through it.
5. Add the parameter to `writeUrl` and `stateFromUrl` so it survives a reload.

The click handling, the counts, the pill label, and the reset button are all keyed off `data-filter` and need no further changes.

## Search

Search is entirely static and client-side, with no index file and no network request. Each card carries `data-search`, built in [src/components/PostCard.astro](./src/components/PostCard.astro) from the post's title and excerpt, lowercased; the archive matches the query as a substring against that string and ANDs the result with the two menus.

Two consequences to be aware of before you rely on it:

- **Only titles and excerpts are matched** — not tags, categories, authors, or article bodies. To widen it, append those values to `searchable` in `PostCard.astro`; the archive picks up whatever is in the attribute with no further changes.
- **The corpus is the rendered page.** The archive ships every published post's markup, which is what makes search free, and also what sets the ceiling: comfortable into the low hundreds of posts, at which point either paginate the archive server-side or move to a generated index — [Pagefind](https://pagefind.app/) is the usual next step and is deliberately not a dependency here.

Results update on submit rather than on every keystroke. To search as you type, listen for `input` on the query field in addition to `submit` on the form; the render path is already idempotent.

## Article Pages

[src/pages/blog/[slug].astro](./src/pages/blog/%5Bslug%5D.astro) assembles the reading page. Most of it follows from the frontmatter, but several parts are generated:

- **Contents** are built from the `##` and `###` headings Astro extracts while rendering, so nothing is maintained by hand. [src/components/TableOfContents.astro](./src/components/TableOfContents.astro) renders no block at all when there are no headings, and marks the current section with an IntersectionObserver. Change the `filter` on `headings` to include `####`, or to restrict the rail to `##` only.
- **Related posts** are scored, not chosen: two points for sharing the category, one for each shared tag, top three. Adjust the weights in `relatedPosts` in [src/lib/blog-data.js](./src/lib/blog-data.js).
- **Previous and next** follow publication order, newest to oldest, across the whole archive rather than within a category.
- **The reading progress bar** is the hairline at the very top of the viewport, driven by a scroll listener in the page's script.
- **Sharing** is three plain controls — X, LinkedIn, and a copy-link button. No third-party script and no tracking pixel is loaded. The links are built at build time from the canonical URL and rewritten to `window.location.href` on load, so a post served from a preview domain shares its actual address. If the clipboard API is unavailable, the copy button falls back to a hidden textarea and `execCommand`.
- **Comments** are a placeholder card, not an integration. Replace the block near the end of the article column with your provider's embed — Giscus, Disqus, or your own — and note that most of them will want the post slug as the thread key.

## Prose and Code

The article body is styled by the `prose-article` utility in [src/styles.css](./src/styles.css), which covers paragraphs, `h2`/`h3`, lists, links, blockquotes, images, rules, inline code, and code blocks in both colour schemes. Because it is defined with `@utility`, it can be applied to any element — the About page uses it for its body copy.

A `callout` utility is available for MDX asides:

```mdx
<div class="callout">A short aside, tinted with the primary colour and ruled on the left.</div>
```

Astro's default Shiki highlighting runs, but `prose-article` deliberately flattens it: `pre span` is forced to a single ink colour in both schemes, so code reads as quiet typography rather than a colour chart. Delete those two `& pre span` rules to get syntax colours back, and set `markdown.shikiConfig` in [astro.config.mjs](./astro.config.mjs) to choose the theme they come from.

Each code block also gets a copy button, injected on load by the script in the post page — it wraps every `pre` in a `.code-block` div and appends the control, so nothing needs to be written into the MDX. The tooltip and copied-state styles live with the rest of `prose-article`.

## Images

Post images live beside the MDX file and go through Astro's image pipeline. `thumbnail` is typed as `image()` in the schema, so it must be a local file next to the post — a remote URL will fail validation. Relative images in the body (`![alt](./detail.jpg)`) are optimized too.

Each surface requests its own sizes rather than sharing one preset: the lead image is served up to 1600px, list thumbnails at 220px, grid cards at up to 480px, and the social image is generated separately at 1200×630 WebP through `getImage`. If you change a card's layout, revisit its `widths` and `sizes` in the same edit — a stale `sizes` is the usual cause of a blurry or oversized card.

`npm run build` finishes by running [scripts/prune-unused-assets.mjs](./scripts/prune-unused-assets.mjs), which deletes original JPG and PNG files from `dist/_astro` that nothing in the built output references. Optimized WebP output is untouched. If you add a surface that references a raster file from somewhere the script cannot see — a hand-written HTML string, say — put the file in `public/` instead, which the script never touches.

## Icons

Icons are inline SVG paths in a single map in [src/components/Icon.astro](./src/components/Icon.astro), so no icon font, sprite, or package is requested. Add one by dropping its path data into the map:

```ts
"chevron-down": '<path d="m6 9 6 6 6-6"></path>',
```

Anything drawn on a 24×24 viewBox with `stroke="currentColor"` fits the existing set. An unknown name renders an empty `<svg>` rather than failing the build, which matters most for `SOCIAL_LINKS`: adding a network there without adding its icon gives you a silent blank square.

## Newsletter and Contact Forms

Both forms are provider-neutral and configured in `FORMS` in [src/config/theme.config.ts](./src/config/theme.config.ts):

```ts
newsletter: {
  action: "https://example.com/subscribe",
  method: "post",
  enctype: "application/x-www-form-urlencoded",
}
```

While `action` is empty — the default — the form retargets to a same-site `GET /contact` instead. That keeps the theme static and provider-free, and deliberately avoids shipping a `mailto:` form submission, which leaks the visitor's address into a URL and trips Lighthouse's best-practices audit. Fill in a real HTTPS endpoint before launch; the fields stay usable either way, so test the endpoint rather than assuming a filled form went somewhere.

[src/components/Newsletter.astro](./src/components/Newsletter.astro) has two variants: the default band at the foot of the homepage and article pages, and `compact` for the sidebar. Both read the same config, so a provider only needs wiring once.

## Sidebar

[src/components/Sidebar.astro](./src/components/Sidebar.astro) renders the masthead editor, the category list, popular and recent posts, the tag cloud, the compact newsletter form, and an RSS link. It is used on category pages only — the archive and tag pages run full width, and articles use their contents rail instead. Add it to another page by importing it into that page's grid.

Two of its lists are simpler than their labels suggest: **Recent** is the four newest posts, and **Popular** is `popularPosts()` in [src/lib/blog-data.js](./src/lib/blog-data.js), which currently also returns the four newest. Wire it to real analytics, sort by a frontmatter flag, or drop the block — but don't ship it as-is expecting engagement data.

## Routes

| Page      | Source                                                     | URL                  |
| --------- | ---------------------------------------------------------- | -------------------- |
| Home      | [src/pages/index.astro](./src/pages/index.astro)           | `/`                  |
| Archive   | [src/pages/blog/index.astro](./src/pages/blog/index.astro) | `/blog`              |
| Article   | `src/pages/blog/[slug].astro`                              | `/blog/<slug>`       |
| Category  | `src/pages/categories/[slug].astro`                        | `/categories/<slug>` |
| Tag       | `src/pages/tags/[slug].astro`                              | `/tags/<slug>`       |
| Author    | `src/pages/authors/[slug].astro`                           | `/authors/<slug>`    |
| About     | [src/pages/about.astro](./src/pages/about.astro)           | `/about`             |
| Contact   | [src/pages/contact.astro](./src/pages/contact.astro)       | `/contact`           |
| Not found | [src/pages/404.astro](./src/pages/404.astro)               | `/404`               |
| Feed      | [src/pages/rss.xml.js](./src/pages/rss.xml.js)             | `/rss.xml`           |
| Sitemap   | [src/pages/sitemap.xml.js](./src/pages/sitemap.xml.js)     | `/sitemap.xml`       |
| Robots    | [src/pages/robots.txt.js](./src/pages/robots.txt.js)       | `/robots.txt`        |

The archive is the only listing that grows without adding routes — it reveals posts in batches in the browser rather than paginating. Category, tag, and author pages render their full list. If a section outgrows one page, the taxonomy routes are where to add Astro's `paginate`.

Replace the starter copy on the About and Contact pages with real masthead, editorial, and legal information. Neither reads its body text from config; both are ordinary pages.

## Theme Tokens

Colours, radii, fonts, base styles, component classes, and the prose utilities all live in [src/styles.css](./src/styles.css). Prefer editing the tokens near the top before touching components.

The palette is a shadcn-style token set written in `oklch`: `--background`, `--foreground`, `--card`, `--popover`, `--primary`, `--secondary`, `--muted`, `--accent`, `--destructive`, `--border`, `--input`, and `--ring`, each with a `-foreground` companion where one is needed. `--radius` (0.5rem) drives the four radius steps. Light values are defined on `:root`; dark mode overrides the same names under `.dark`.

The `@theme inline` block maps every token into Tailwind's namespace, which is what makes `bg-background`, `text-muted-foreground`, `border-border`, `rounded-md`, and `font-serif` work. Add a token in both places — the `:root`/`.dark` blocks and the `@theme` block — and it becomes available as a utility everywhere.

To restyle the theme, change the token values rather than the utilities in the markup. A new accent colour is one edit to `--primary` in each scheme; it carries to links, active states, the reading progress bar, the tag hovers, and the focus ring.

## Dark Mode

Dark mode is a class on `<html>`, applied before first paint by the inline script in [src/layouts/BaseLayout.astro](./src/layouts/BaseLayout.astro): a stored choice in `localStorage.theme` wins, otherwise `prefers-color-scheme` decides. Because it runs in the head, there is no flash of the wrong scheme. The toggle in [src/components/Header.astro](./src/components/Header.astro) writes that key.

The `dark` variant is registered as `@custom-variant dark (&:is(.dark *))`, so `dark:` utilities and `.dark &` selectors both work. To ship a single scheme, drop the toggle from the header and the `.dark` block from the stylesheet; leave the inline script alone or remove it entirely, not half.

## Fonts

Three families are self-hosted from [public/fonts](./public/fonts) as latin-subset `woff2` files: Fraunces for display and headings (`--font-serif`), Inter for UI and body text (`--font-sans`), and JetBrains Mono for code and numeric labels (`--font-mono`). Each is declared with a variable weight range, `font-display: swap`, and a `unicode-range` so the browser can skip the file for text it cannot cover.

Only Inter and Fraunces are preloaded in [src/layouts/BaseLayout.astro](./src/layouts/BaseLayout.astro), since those two carry everything above the fold. JetBrains Mono is left to load on demand.

To change typefaces: drop your `woff2` files into `public/fonts`, rewrite the matching `@font-face` rules and the `--font-*` tokens at the top of [src/styles.css](./src/styles.css), and update the two preload tags. If you add a family, subset it — an unsubsetted variable font will undo the theme's page weight.

## SEO

[src/layouts/BaseLayout.astro](./src/layouts/BaseLayout.astro) owns the document head. Every page passes what it needs as props:

| Prop          | Purpose                                                             |
| ------------- | ------------------------------------------------------------------- |
| `title`       | `<title>`, `og:title`, `twitter:title`                              |
| `description` | Meta description and both social descriptions                       |
| `canonical`   | Canonical path; resolved to an absolute URL                         |
| `ogType`      | `website` by default, `article` on posts                            |
| `ogImage`     | Social image; resolved to an absolute URL                           |
| `jsonLd`      | Serialized into a `application/ld+json` script when present         |
| `flushFooter` | Removes the footer's top margin, for pages ending in a full section |

Only article pages emit structured data, as `BlogPosting`. The breadcrumb trail rendered by [src/components/Breadcrumbs.astro](./src/components/Breadcrumbs.astro) is presentational; add a `BreadcrumbList` object to the page's `jsonLd` if you want it in search results.

The feed, sitemap, and robots endpoints are plain Astro endpoints, not integrations, so they are easy to edit: [rss.xml.js](./src/pages/rss.xml.js) publishes titles, links, dates, authors, and excerpts for every non-draft post — no full article bodies, so subscribers click through. Whatever you change, keep drafts excluded: all three read the same `sortedPosts()` helper, which filters them out once.

## Before Launch

- Set `SITE_URL` in the build environment, and confirm a built page's canonical tag shows your domain (see [Production URL](#production-url)).
- Replace `SITE`, `NAVIGATION`, `CONTACT`, and `SOCIAL_LINKS` with real values, and delete the demo repository link.
- Replace the demo authors and their avatars; remember `authors[0]` fronts the sidebar.
- Prune categories and tags down to what you actually publish, so no empty taxonomy page reaches the sitemap.
- Replace the eight demo posts in [src/content/blog](./src/content/blog), including their images and credits.
- Fill in `FORMS.contact.action` and `FORMS.newsletter.action`, then submit both forms against the real endpoints.
- Rewrite the About and Contact copy, and the homepage hero headline.
- Replace [public/favicon.svg](./public/favicon.svg) and the hero image.
