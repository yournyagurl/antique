import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Adminnav.css'; // optional, if you have styling

const Adminnav = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menu, setMenu] = useState('home');

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };


  return (
    <div>
      <div className="menu-toggle" onClick={toggleDropdown}>
        <p>MENU</p>
        <span className="burger-menu">{dropdownOpen ? '✖' : '☰'}</span>
      </div>

      <div className={`navbar ${dropdownOpen ? 'open' : ''}`}>
        <ul className="nav-menu">
          <li onClick={() => setMenu('add')}>
            <Link to="/add" className={`nav-button ${menu === 'home' ? 'active' : ''}`}>
              ADD PRODUCT
            </Link>
          </li>
          <li onClick={() => setMenu('about')}>
            <Link to="/list" className={`nav-button ${menu === 'about' ? 'active' : ''}`}>
              LIST PRODUCTS
            </Link>
          </li>
          <li className="dropdown" onClick={() => setMenu('inventory')}>
            <Link to="/currentorders" className={`nav-button ${menu === 'inventory' ? 'active' : ''}`}>
              PENDING
            </Link>
          </li>
          <li onClick={() => setMenu('contact')}>
            <Link to="/pastorders" className={`nav-button ${menu === 'contact' ? 'active' : ''}`}>
              COMPLETE
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Adminnav;
