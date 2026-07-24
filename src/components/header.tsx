import { Link } from 'waku';

export const Header = () => {
  return (
    <header className="site-header">
      <Link to="/" className="site-header__brand" unstable_instant>
        On This Month in JavaScript
      </Link>
    </header>
  );
};
