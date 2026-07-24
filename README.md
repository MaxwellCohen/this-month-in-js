# On This Month in JavaScript

Browse JavaScript features by when they crossed [Baseline](https://web.dev/baseline) thresholds — newly available by calendar month, or widely available across the platform.

Pick a month (`/july`, `/march`, …) for newly available history, or open `/widely` for features that are widely available and what’s graduating next month.

## Stack

- [Waku](https://waku.gg/) (React Server Components)
- React 19 + React Compiler
- Tailwind CSS 4
- TypeScript

## Data

Baseline dates come from [`web-features`](https://github.com/web-platform-dx/web-features). MDN links are resolved via the [web-features-mappings](https://github.com/web-platform-dx/web-features-mappings) MDN docs map. Both are fetched when a page is (re)generated and cached in memory for one week.

Pages stay `dynamic` but are cached on the Vercel CDN for **one week** (`s-maxage=604800` + `stale-while-revalidate`), so Baseline updates show up without a redeploy — ISR-style via `Cache-Control`.

Only features in the JavaScript group (and its subgroups) are included. “Coming next month” on `/widely` projects graduations as **30 months after** each feature’s Baseline low date (features that are still newly available).

## Develop

```sh
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

| Script        | Description              |
| ------------- | ------------------------ |
| `npm run dev` | Start the Waku dev server |
| `npm run build` | Production build       |
| `npm start`   | Serve the production build |
| `npm run typegen` | Regenerate router types |

## Routes

| Path           | Behavior                                      |
| -------------- | --------------------------------------------- |
| `/`            | Landing page with links to this month and `/widely` |
| `/widely`      | Widely available list + next-month graduations |
| `/[month]`     | Features newly available in that month        |
| Invalid month  | 404                                           |

Month slugs are lowercase English month names: `january` … `december`.
