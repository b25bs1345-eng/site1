# Udita Homestay Blog Workflow

The public blog is served from `blogs.html`.

## Adding a new article

1. Add or update an article card inside the `.blog-grid` section of `blogs.html`.
2. Store article photography in `assets/images/` and reference it with a relative path such as `assets/images/blog-my-story.jpg`.
3. Keep the existing card structure and classes so typography, spacing and responsive behavior remain consistent.
4. For a fully published article, replace the `Coming soon` state with the article link and update the date, category and reading time.
5. Keep factual travel information current and verify changing details such as timings, access rules and event dates before publishing.
6. Credit externally sourced photography on the page and retain the source/license information.

## Current blog image assets

The repository currently includes:
- `assets/images/blog-thali.jpg`
- `assets/images/blog-luchi-sandesh.jpg`
- `assets/images/blog-sandesh.jpg`
- `assets/images/blog-chai.jpg`
- `assets/images/blog-santiniketan-garden.jpg`

These are locally stored copies sourced from Wikimedia Commons. The corresponding article-card credits link to each source page and license.

## Image refresh

`.github/workflows/blog-images.yml` downloads the approved Wikimedia Commons source images into `assets/images/` and commits them with the repository's normal GitHub Actions identity. The workflow is deliberately scoped so the generated image commit does not create an endless workflow loop.

## Design rules

- Keep the existing cream, green, brown and muted-gold palette.
- Prefer high-quality landscape photography with descriptive `alt` text.
- Do not change the existing home page sections, booking links, contact details or social buttons when publishing a blog post.
- Keep titles concise and editorial rather than promotional.
- Use authoritative sources for historical or heritage claims.
