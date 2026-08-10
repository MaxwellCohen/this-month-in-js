import { MDN_DOCS_URL, WEB_FEATURES_URL } from '@/lib/baseline';

export const Footer = () => {
  return (
    <footer className="border-t border-line/70">
      <div className="mx-auto flex w-full max-w-shell flex-wrap items-baseline justify-between gap-x-6 gap-y-2 px-6 py-7 text-[0.85rem] text-muted [&_a]:text-muted [&_a:hover]:text-accent [&_p]:m-0">
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
        <p className="font-mono text-[0.72rem] tracking-[0.02em]">
          <a href={WEB_FEATURES_URL} target="_blank" rel="noreferrer">
            data.json
          </a>
          <span className="mx-2 text-line-bright">/</span>
          <a href={MDN_DOCS_URL} target="_blank" rel="noreferrer">
            MDN mapping
          </a>
        </p>
      </div>
    </footer>
  );
};
