import React from 'react'
import './Header.css'
import { assets } from '../../assets/assets'

const Header = () => {
  return (
    <div className='hero'>
        <div className='main-home-page-banner'>
            <img src={assets.banner} alt='banner'/>
        </div>
        <div className="content-appear">
			 		<h2>WELCOME</h2>
					<p>to</p>
          <h1>STOKES</h1>
          <h2> INTERIORS AND COLLECTIBLES</h2>
          <button className='info-button' onClick={() => window.location.href = '/inventory'}>VIEW COLLECTION</button>
				</div>
    </div>
  )
}

export default Header