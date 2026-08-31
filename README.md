# CSD Class Hub

A small interactive yearbook for the computer science class, built from the classroom survey.

## Open the site

Double-click `index.html`, or in Terminal:

```bash
open /Users/marcwallis/csd-class-hub/index.html
```

No install and no server needed.

## What’s on the page

- Random classmate spotlight / icebreaker
- Class pulse: coding experience, screen time, games, snacks
- Room wishlist: posters, snacks, prizes
- Searchable student cards with filters
- Find a classmate by shared games, music, or hobbies
- Processing lab (`lab.html`): interactive If/Then, comparing, finding a match, and counting

Names are shown as **first name + last initial**. Survey answers about fears, extra help, and private support notes are not included.

## Update the data later

Replace the CSV, then run:

```bash
python3 generate_data.py
```

That rebuilds `data.js`. Refresh the browser to see the change.
