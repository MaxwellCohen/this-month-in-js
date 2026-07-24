# On This Month in JavaScript

Browse JavaScript features that became [Baseline newly available](https://web.dev/baseline) in a given calendar month — across every year.

Pick a month (`/july`, `/march`, …) and see which JS features crossed the Baseline “newly available” threshold that month, grouped by year, with links to MDN.

## Stack

- [Waku](https://waku.gg/) (React Server Components)
- React 19 + React Compiler
- Tailwind CSS 4
- TypeScript

## Data

Baseline dates come from [`web-features`](https://github.com/web-platform-dx/web-features). MDN links are resolved via the [web-features-mappings](https://github.com/web-platform-dx/web-features-mappings) MDN docs map. Both are fetched when a page is (re)generated and cached in memory for one week.

Pages stay `dynamic` but are cached on the Vercel CDN for **one week** (`s-maxage=604800` + `stale-while-revalidate`), so Baseline updates show up without a redeploy — ISR-style via `Cache-Control`.

Only features in the JavaScript group (and its subgroups) are included.

## Develop

```sh
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000). The home page redirects to the current month (UTC).

| Script        | Description              |
| ------------- | ------------------------ |
| `npm run dev` | Start the Waku dev server |
| `npm run build` | Production build       |
| `npm start`   | Serve the production build |
| `npm run typegen` | Regenerate router types |

## Routes

| Path           | Behavior                                      |
| -------------- | --------------------------------------------- |
| `/`            | Redirects to the current month (UTC)          |
| `/[month]`     | Features newly available in that month        |
| Invalid month  | 404                                           |

Month slugs are lowercase English month names: `january` … `december`.
