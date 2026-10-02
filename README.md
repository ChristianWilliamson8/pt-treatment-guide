# PT Treatment Guide

A session guide for a physical therapist assistant. Search a diagnosis, pick a treatment option that is already in the physical therapist's plan of care, and print the card.

The cards are general practice notes. Your evaluation, the weight-bearing order, surgeon precautions, and the physician order override the card.

## Open it

https://christianwilliamson8.github.io/pt-treatment-guide/

On this computer you can also open `index.html` in a browser. Search, category buttons, and print work without a server.

## Add a diagnosis

Edit `data/diagnoses.js`. Copy an existing object and keep the same fields:

- `id` — short name used in the link, such as `#lbp`
- `name`, `aliases`, `category`, `snapshot`
- `redFlags`, `precautions`, `options`, `assess`, `progress`, `hep`, `escalate`

`options` is the session menu. Start each line with a short name, then a colon, then the dose and the stop rule. Example: `Heel prop: 5 minutes total, no pillow under the knee.`

Categories in the filter are Spine, Shoulder, Knee/Hip, Ankle, Neuro, and Geriatric. A new category also needs to be added to `CATEGORIES` in `app.js`.
