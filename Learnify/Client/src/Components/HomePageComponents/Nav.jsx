import { Link, useLocation } from 'react-router-dom';
import '../../CSS/home.css';

export default function Nav() {
  const location = useLocation(); // Get the current location path

  return (
    <ul className="cs_nav_list fw-medium">
      <li
        className={`menu-item-has-children ${
          location.pathname === '/courses' ? 'active' : ''
        }`}
      >
        <Link to="/courses">Learn</Link>
      </li>

      <li
        className={`menu-item-has-children ${
          location.pathname === '/explore' ? 'active' : ''
        }`}
      >
        <Link to="/explore">Explore</Link>
      </li>

      <li
        className={`menu-item-has-children ${
          location.pathname === '/files/file' ? 'active' : ''
        }`}
      >
        <Link to="/files/file">Habit Tracker</Link>
      </li>

      <li
        className={`menu-item-has-children ${
          location.pathname === '/calendar' ? 'active' : ''
        }`}
      >
        <Link to="/calendar">Calendar</Link>
      </li>

      <li
        className={`menu-item-has-children ${
          location.pathname === '/blog' ? 'active' : ''
        }`}
      >
        <Link to="/blog">Chats</Link>
      </li>
    </ul>
  );
}
