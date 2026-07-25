import { MDN_DOCS_URL, WEB_FEATURES_URL } from '@/lib/baseline';

export const Footer = () => {
  return (
    <footer className="mx-auto w-full max-w-shell px-6 py-6 text-[0.85rem] text-muted [&_a]:text-muted [&_a:hover]:text-accent [&_p]:m-0">
      <p>
        Baseline dates from{' '}
        <a
          href="https://github.com/web-platform-dx/web-features"
          target="_blank"
          rel="noreferrer"
        >
          web-features
        </a>
        . Docs via{' '}
        <a
          href="https://developer.mozilla.org/"
          target="_blank"
          rel="noreferrer"
        >
          MDN
        </a>
        .
      </p>
      <p className="mt-[0.45rem] font-mono text-xs tracking-[0.01em]">
        Underlying data:{' '}
        <a href={WEB_FEATURES_URL} target="_blank" rel="noreferrer">
          web-features data.json
        </a>
        {' · '}
        <a href={MDN_DOCS_URL} target="_blank" rel="noreferrer">
          MDN docs mapping
        </a>
      </p>
    </footer>
  );
};
