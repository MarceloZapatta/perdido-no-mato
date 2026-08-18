# Changelog

All notable changes to Quiet Pages will be documented in this file.

## [2.2.0] - 2026-08-12

### Added

- Added `CUSTOMIZATION.md`, a guide covering site settings, authors, taxonomies, frontmatter, the homepage, archive filters, search, article pages, prose and code, images, icons, forms, routes, theme tokens, dark mode, fonts, SEO, and a pre-launch checklist.
- Added `chevron-down` to the shared `Icon` component.
- Added live option counts to the archive filters, each measured against the other active filters and the search query, so a row shows what selecting it would return.
- Added a `Clear filters` control to the archive that appears once a category or tag is active.

### Changed

- Bumped the theme package version to `2.2.0`.
- Replaced the archive category and tag chip rows with two pill dropdown menus, so blogs with many tags keep a single-row filter bar. Each menu row remains a real link to its taxonomy page before JavaScript enhancement.
- Archive filter menus now open one at a time and close on selection, outside click, or `Escape`; the selected row is marked with `aria-current` and font weight rather than colour alone.
- Archive filter options with no matching posts are dropped at build time, and options that would return nothing under the current filters are dimmed instead of removed.

## [2.1.0] - 2026-07-01

### Added

- Added a local SVG favicon and linked it from the shared document head.

### Changed

- Bumped the theme package version to `2.1.0`.
- Tuned homepage hero and post-card image output to reduce PageSpeed image-delivery savings while preserving responsive Astro image generation.
- Added `fetchpriority="high"` to the homepage LCP hero image.
- Updated default contact and newsletter form behavior so unconfigured static themes no longer ship `mailto:` form submissions; forms now fall back to same-site `GET` targets until HTTPS provider endpoints are configured.
- Updated README form guidance to document the empty default endpoints and recommended HTTPS provider setup.

### Fixed

- Fixed PageSpeed/Lighthouse best-practices warnings for `mailto:` form submissions.
- Fixed the LCP request discovery warning by explicitly prioritizing the eagerly loaded hero image.
- Improved small metadata link touch targets in post cards and featured content.
- Fixed the missing favicon request that caused a browser console 404 in Lighthouse.

## [2.0.0] - 2026-06-30

### Added

- Added Astro 7 support with `astro` `^7.0.4`, `@astrojs/mdx` `^7.0.0`, and Vite 8.
- Added centralized theme configuration in `src/config/theme.config.ts` for site metadata, navigation, contact details, form endpoints, social links, authors, categories, and tags.
- Added local initials-based author avatars in `public/avatars`.
- Added optional blog frontmatter fields for `seoTitle`, `seoDescription`, `canonical`, `updated`, `readingTime`, `featured`, and `draft`.
- Added required `thumbnailAlt` frontmatter for meaningful article images.
- Added automatic reading-time estimation when `readingTime` is omitted.
- Added generated WebP social images for article Open Graph, Twitter card, and JSON-LD metadata.
- Added `scripts/prune-unused-assets.mjs` to remove unreferenced original JPG/PNG files from the production asset directory after build.

### Changed

- Bumped the theme package version to `2.0.0`.
- Updated archive category and tag controls to link to real static taxonomy pages before JavaScript enhancement.
- Updated contact and newsletter forms to use configurable actions, semantic labels, field names, and autocomplete attributes.
- Replaced external demo avatars with local initials badges.
- Tuned Astro image output for hero images, article covers, cards, and social previews.
- Switched self-hosted fonts to `font-display: swap`.
- Removed negative/tight letter-spacing from display headings while keeping uppercase label spacing.
- Updated README setup, content, forms, assets, and release workflow documentation.

### Removed

- Removed the unused `tw-animate-css` dependency and import.
- Removed demo-only JavaScript submit handlers from contact and newsletter forms.
- Removed manual `readingTime` values from starter MDX posts so automatic estimates are used by default.

## [1.0.0] - 2026-06-19

### Added

- Initial public release of Quiet Pages, an Astro magazine theme for essays, field notes, blogs, and long-form editorial sites.
- Editorial homepage with a full-bleed visual lead story, featured post section, latest posts, and newsletter CTA.
- MDX blog posts powered by Astro content collections with validated frontmatter.
- Blog archive with client-side search, category filters, tag filters, and load-more pagination.
- Category, tag, and author archive pages.
- Article pages with breadcrumbs, table of contents, featured image captions, sharing links, author cards, related posts, and previous/next navigation.
- RSS feed, XML sitemap, and dynamic robots.txt route.
- SEO defaults including canonical URLs, Open Graph metadata, Twitter card metadata, and article JSON-LD.
- Light and dark mode with system preference support.
- Self-hosted Inter, Fraunces, and JetBrains Mono fonts.
- Responsive images through Astro's image pipeline.
- Accessibility defaults including semantic landmarks, skip link, visible focus styles, current-page navigation state, keyboard-friendly search/menu controls, and reduced-motion handling.
