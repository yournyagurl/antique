import React from 'react'
import './Header.css'

const Header = () => {
  return (
    <div className='hero'>
        <div className='main-home-page-banner'>
            <img src="https://res.cloudinary.com/dtqvxfc7w/image/upload/v1743890233/antique-plate-display-stockcake_jyfwwo.jpg" alt='banner'/>
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