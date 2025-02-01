import { useEffect, useState } from 'react';
import { Link ,useNavigate } from 'react-router-dom';
import Nav from './Nav';
import React from 'react';
import { IconButton, Badge, Box,Avatar, Menu, MenuItem,ListItemIcon, Typography  } from '@mui/material';
import { IconBellRinging} from '@tabler/icons-react';
import { Person,Logout, Dashboard,LocalFireDepartment  } from '@mui/icons-material';
import profileImage from '../../assets/images/profile/tala.png';
import Cookies from 'js-cookie'
import '../../CSS/home.css';

export default function Header1({ variant }) {
  const [mobileToggle, setMobileToggle] = useState(false);
  const [isSticky, setIsSticky] = useState();
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const [isStreakOn, setIsStreakOn] = useState(true); // State to track streak status

 // Cookies.remove();

  useEffect(() => {
    const  initializeUser = () => {
    const token = Cookies.get('token');
      if (token) {
        setIsLoggedIn(true);
      } 
    };
    initializeUser(); 
  }, []);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const goToProfile = () => {
    navigate('/Profile');
    handleMenuClose();
  };

  const goToDashboard = () => {
    navigate('/dashboard');
    handleMenuClose();
  };

  const handleLogout = () => {
    Cookies.remove('token', { path: '/' });
    navigate('/auth/logout'); // Redirect to logout logic or page
    handleMenuClose();
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      if (currentScrollPos > prevScrollPos) {
        setIsSticky('cs-gescout_sticky'); // Scrolling down
      } else if (currentScrollPos !== 0) {
        setIsSticky('cs-gescout_show cs-gescout_sticky'); // Scrolling up
      } else {
        setIsSticky();
      }
      setPrevScrollPos(currentScrollPos); // Update previous scroll position
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll); // Cleanup the event listener
    };
  }, [prevScrollPos]);

  return (
    <div className='header-area2 header_nav_03'>
    <header
      className={`cs_site_header cs_style_1 ${
        variant ? variant : ''
      } cs_sticky_header cs_site_header_full_width ${
        mobileToggle ? 'cs_mobile_toggle_active' : ''
      } ${isSticky ? isSticky : ''}`}
    >
      <div className="cs_main_header cs_accent_bg">
        <div className="container">
          <div className="cs_main_header_in">
            <div className="cs_main_header_left">
              <Link className="cs_site_branding" to="/">
                <img src="/assets/img/logo/a+logo.png" alt="Logo" style={{margin:0, padding:0 ,display: 'block', maxHeight: '100%' }} />
              </Link>
            </div>
              <div className="cs_main_header_center1">
                <div className="cs_nav cs_primary_font fw-medium">
                  <span
                    className={
                      mobileToggle
                        ? 'cs-munu_toggle cs_teggle_active'
                        : 'cs-munu_toggle'
                    }
                    onClick={() => setMobileToggle(!mobileToggle)}
                  >
                    <span></span>
                  </span>
                  <Nav setMobileToggle={setMobileToggle} />
                </div>
            </div>
            <div className="cs_main_header_right header_right_one">
            {isLoggedIn ? (
                  <div className="nav-icons-container" style={{ display: 'flex', alignItems: 'center' }}>
                                        <LocalFireDepartment
              fontSize="large"
              style={{
                color: isStreakOn ? 'orange' : 'inherit', // Orange when streak is on, default when off
              }}
              
            />
                                <Box flexGrow={3} />

                    {/* Notification Icon */}
                    <IconButton
                      size="large"
                      aria-label="show 11 new notifications"
                      color="inherit"
                      aria-controls="msgs-menu"
                      aria-haspopup="true"
                      sx={{
                        ...(typeof anchorEl2 === 'object' && {
                          color: 'primary.main',
                        }),
                      }}
                    >
                    <Badge color="inherit">
                        <IconBellRinging size="30" stroke="2" />
                      </Badge>
                    </IconButton> 
                    <Box flexGrow={2} />
                    {/* Add space between the icons */}
                    <Box flexGrow={3} />
              
      
     
        {/* Profile Avatar */}
      <Avatar
        src={profileImage} // Replace with the path to the profile image
        alt="Profile Avatar"
        onClick={handleMenuOpen}
        style={{ cursor: 'pointer' }}
      />
      {/* Dropdown Menu */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >

        <MenuItem  onClick={goToDashboard}>
          <ListItemIcon>
            <Dashboard fontSize="small" />
          </ListItemIcon>
          <Typography variant="inherit">Dashboard</Typography>
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small"/>
          </ListItemIcon>
          <Typography variant="inherit">Logout</Typography>
        </MenuItem>
      </Menu>
    </div>
                ) : (
          <div className="header1-buttons">
            <div className="button">
            <Link to="/auth/Login" className="theme-btn1">
              Login<span></span>
            </Link>
            </div>
    </div>
)}
            </div>
          </div>
        </div>
      </div>
    </header>
    </div>
  );
}
