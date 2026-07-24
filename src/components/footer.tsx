import { MDN_DOCS_URL, WEB_FEATURES_URL } from '../lib/baseline';

export const Footer = () => {
  return (
    <footer className="site-footer">
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
      <p className="site-footer__data">
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
