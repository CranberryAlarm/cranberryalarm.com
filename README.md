# cranberryalarm.com

The Cranberry Alarm website: one static page in [site/](site/), with no dependencies and no build step. See [GLOSSARY.md](GLOSSARY.md) for the terms used here.

## Preview

```bash
python -m http.server 4173 --directory site
```

Then open http://localhost:4173.

## Check

```bash
python scripts/check_site.py
```

Checks that every nav link has a section to scroll to and every local file exists. The deploy runs it first.

## Deploy

Every push to `master` runs [.github/workflows/pages.yml](.github/workflows/pages.yml), which publishes `site/` to GitHub Pages. The deploy step is skipped while the repo is private.

## Each Season

All in [site/index.html](site/index.html):

1. Copy the newest `<li class="robot">` to the top of the Robots list and fill in the Robot's name, game and Resources. Give it the new `id` (`robot-2027`), change both years inside it, and add a matching link at the start of the `robot-years` nav just above the list.
2. Change the year and text in the Featured Season section (`id="season"`) and the first nav link.
3. Recount the Impact Numbers using [docs/impact-numbers.md](docs/impact-numbers.md) and update the "Counted in" date.

## Before launch

See issues #1 (domain and the `noindex` tag) and #2 (Google Analytics and the privacy notice). Search `site/index.html` for `LAUNCH` and `FILLER` to find everything that is still a stand-in.
