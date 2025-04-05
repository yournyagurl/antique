import React from 'react'
import './Footer.css'
import {assets} from '../../assets/assets'
const Footer = () => {
  return (
    <div className='footer'>

        <div className='footer-logo'>
            <img src={assets.logo} alt='logo'/>
        </div>

        <div className='footer-info'>
            <p>STOKES INTERIORS AND COLLECTIBLES</p>
            <p>
Maxwell Cl
Buckley
CH7-3JF</p>
        </div>

        <hr className='one'/>

        <ul className='footer-list'>
            <li>PRIVACY POLICY</li>
            <li>TERMS AND CONDITIONS</li>
            <li>ABOUT US</li>
            <li>INVENTORY</li>
            <li>CONTACT</li>
        </ul>

        {/* <div className='social-media'>
            <p>Follow Us</p>
            <div className='social-media-icons'>
                <img src='https://img.icons8.com/color/48/000000/facebook-new.png' alt='facebook'/>
                <img src='https://img.icons8.com/color/48/000000/instagram-new.png' alt='instagram'/>
                </div>
        </div> */}

<hr className='two'/>
        <div className='copyright'>
            <p>Copyright &copy; 2023 Stokes Interiors and Collectibles</p>
        </div>


    </div>
  )
}

export default Footer