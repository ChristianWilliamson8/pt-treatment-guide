# PT Treatment Guide

A personal reference for physical therapists. Search a diagnosis, read a short treatment card, and print it on one page.

The cards are general practice notes. Your evaluation, the weight-bearing order, surgeon precautions, and the physician order override the card.

## Open it

After it is published, use the GitHub Pages link on your phone or a clinic computer.

On this computer you can also open `index.html` in a browser. Search, category buttons, and print work without a server.

## Add a diagnosis

Edit `data/diagnoses.js`. Copy an existing object and keep the same fields:

- `id` — short name used in the link, such as `#lbp`
- `name`, `aliases`, `category`, `snapshot`
- `redFlags`, `precautions`, `assess`, `treat`, `progress`, `hep`, `escalate`

Categories in the filter are Spine, Shoulder, Knee/Hip, Ankle, Neuro, and Geriatric. A new category also needs to be added to `CATEGORIES` in `app.js`.
