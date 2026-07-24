import { Link } from 'waku';

export const Header = () => {
  return (
    <header className="site-header">
      <Link to="/" className="site-header__brand">
        On This Month in JavaScript
      </Link>
      <nav className="site-header__nav" aria-label="Site">
        <Link to="/widely" className="site-header__link">
          Widely available
        </Link>
      </nav>
    </header>
  );
};
