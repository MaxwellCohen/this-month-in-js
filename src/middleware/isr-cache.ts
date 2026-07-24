import type { MiddlewareHandler } from 'hono';

/** 7 days — Vercel CDN ISR window for dynamic pages */
const ISR_SECONDS = 60 * 60 * 24 * 7;

const CACHE_CONTROL = `public, s-maxage=${ISR_SECONDS}, stale-while-revalidate=${ISR_SECONDS}`;

function isCacheablePath(path: string): boolean {
  // Skip static assets and anything with a file extension
  if (path.includes('.')) {
    return false;
  }
  return true;
}

/**
 * Cache successful HTML/RSC responses on the Vercel CDN for one week,
 * then regenerate in the background (ISR-style via Cache-Control).
 */
export default (): MiddlewareHandler => {
  return async (c, next) => {
    await next();

    if (!isCacheablePath(c.req.path)) {
      return;
    }

    const status = c.res.status;
    if (status < 200 || status >= 400) {
      return;
    }

    c.header('Cache-Control', CACHE_CONTROL);
  };
};
