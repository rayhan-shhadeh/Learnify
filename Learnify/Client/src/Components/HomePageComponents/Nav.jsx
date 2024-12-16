import DropDown from './DropDown';
import '../../CSS/home.css';

import { Link } from 'react-router-dom';
export default function Nav() {
  return (
    <ul className="cs_nav_list fw-medium">



      <li className="menu-item-has-children">
        <Link to="/about" >
        Learn  
        </Link>
      </li>      

      <li className="menu-item-has-children">
        <Link to="#">Explore</Link>
      </li>   

      <li className="menu-item-has-children">
        <Link to="/project">
         Habit Tracker  
        </Link>
      </li>    

      <li className="menu-item-has-children">
        <Link to="/calendar">
          Calendar
        </Link>
      </li>   
        
      <li className="menu-item-has-children">
        <Link to="/blog">
          Chats
        </Link>
      </li>

    </ul>
  );
}
