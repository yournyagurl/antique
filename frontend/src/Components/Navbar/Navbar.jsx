import React, {  useState } from 'react';
import { assets } from '../../assets/assets.js';
import { Link } from 'react-router-dom';
import './Navbar.css';
import { userUserStore } from '../../stores/useUserStore.js';
import { useCartStore } from '../../stores/useCartStore.js';

const Navbar = () => {
  const {user, logout} = userUserStore();
  let isAdmin = false;

if (user && user.role && user.role.toLowerCase() === 'admin') {
  isAdmin = true;
}


  {console.log('User info:', user)}
{console.log('Is admin:', isAdmin)}


  const [menu, setMenu] = useState('Home');
  const [inventoryPage, setInventoryPage] = useState('fullCollection');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [inventoryDropdownOpen, setInventoryDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const { calculateTotals } = useCartStore();

  const toggleProfileDropdown = () => {
    setProfileDropdownOpen((prev) => !prev);
  };

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  const handleInventoryClick = () => {
    setInventoryDropdownOpen((prev) => !prev);
    setMenu('inventory');
    setInventoryPage('fullCollection'); // Default to full collection when clicked
  };

  return (
    <>
      <div className="topbar-outer">
        <div className="topbar-main">
          <div className="site-welcome-message">
            <h1>STOKES INTERIORS AND COLLECTIBLES</h1>
          </div>
          <div className="topbar-link-wrapper">
            <span className="topbar-link">
              {!user ? (
                <Link to="/login" >
                  <img src={assets.signin} alt="Login" />
                </Link>
              ) : (
                <div className="navbar-profile">
                  <span onClick={toggleProfileDropdown} className="profile-button">
                    <img src={assets.profile} alt="Profile" />
                  </span>

                  {profileDropdownOpen && (
                    <div className="profile-dropdown">
                      <Link to="/orders">Orders</Link>
                      <hr />
                      <Link onClick={logout}>Logout</Link>
                      <hr />
                      {isAdmin && <Link to="/secret-dashboard">Admin</Link>}
                    </div>
                  )}
                </div>
              )}
            </span>

            <span className="cart-link">
              <Link to="/cart">
                <img src={assets.cart} alt="Cart" />
                {calculateTotals > 0 && <span className="cart-indicator"></span>}
              </Link>
            </span>
          </div>
        </div>
      </div>

      <div className="logo-container">
        <img src={assets.logo} alt="Stokes Interiors Logo" />
      </div>

      {/* Menu Toggle for Mobile */}
      <div className="menu-toggle" onClick={toggleDropdown}>
        <p>MENU</p>
        <span className="burger-menu">{dropdownOpen ? '✖' : '☰'}</span>
      </div>

      {/* Navigation Bar */}
      <div className={`navbar ${dropdownOpen ? 'open' : ''}`}>
        <ul className="nav-menu">
          <li onClick={() => setMenu('home')}>
            <Link to="/" className={`nav-button ${menu === 'home' ? 'active' : ''}`}>
              HOME
            </Link>
          </li>
          <li onClick={() => setMenu('about')}>
            <Link to="/about" className={`nav-button ${menu === 'about' ? 'active' : ''}`}>
              ABOUT US
            </Link>
          </li>

          {/* Inventory Dropdown */}
          <li className="dropdown">
            <button
              className={`nav-button ${menu === 'inventory' ? 'active' : ''}`}
              onClick={handleInventoryClick}
            >
              INVENTORY
            </button>
            <div className={`dropdown-menu ${inventoryDropdownOpen ? 'show' : ''}`}>
              <ul>
                <li onClick={() => setInventoryPage('fullCollection')}>
                  <Link
                    to="/shop"
                    className={`dropdown-button ${inventoryPage === 'fullCollection' ? 'active' : ''}`}
                  >
                    FULL COLLECTION
                  </Link>
                </li>
                <li onClick={() => setInventoryPage('furniture')}>
                  <Link
                    to="/shop/furniture"
                    className={`dropdown-button ${inventoryPage === 'furniture' ? 'active' : ''}`}
                  >
                    FURNITURE
                  </Link>
                </li>
                <li onClick={() => setInventoryPage('collectibles')}>
                  <Link
                    to="/shop/collectibles"
                    className={`dropdown-button ${inventoryPage === 'collectibles' ? 'active' : ''}`}
                  >
                    COLLECTIBLES
                  </Link>
                </li>
                <li onClick={() => setInventoryPage('arts')}>
                  <Link
                    to="/shop/arts"
                    className={`dropdown-button ${inventoryPage === 'arts' ? 'active' : ''}`}
                  >
                    ARTS
                  </Link>
                </li>
                <li onClick={() => setInventoryPage('miscellaneous')}>
                  <Link
                    to="/shop/oddities"
                    className={`dropdown-button ${inventoryPage === 'miscellaneous' ? 'active' : ''}`}
                  >
                    MISCELLANEOUS
                  </Link>
                </li>
              </ul>
            </div>
          </li>

          <li onClick={() => setMenu('contact')}>
            <Link to="/contact" className={`nav-button ${menu === 'contact' ? 'active' : ''}`}>
              CONTACT
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
};

export default Navbar;
