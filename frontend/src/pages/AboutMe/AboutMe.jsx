import React from 'react';
import './AboutMe.css';

const AboutPage = () => {
  return (
    <div className="about-page" style={{ margin: '0 auto', padding: '20px', maxWidth: '800px' }}>
      <h1 style={{ textAlign: 'center', color: '#fef2c3' }}>About Stokes Antiques & Collectibles</h1>
      
      <p style={{ fontSize: '1.1em', lineHeight: '1.6' }}>
        Welcome to <strong>Stokes Antiques & Collectibles</strong>, where British history comes to life.
      </p>

      <p style={{ fontSize: '1.1em', lineHeight: '1.6' }}>
        Founded and run by <strong>Carl Stokes</strong>, a lifelong collector with a passion for British craftsmanship, our shop offers a carefully curated collection of rare and remarkable items—many dating back to the <strong>1700s</strong>. From Georgian furniture to Victorian curiosities, each piece reflects the elegance and quality of British heritage. Carl personally selects each item, ensuring it tells a story of craftsmanship, history, and artistry that spans centuries.
      </p>

      <p style={{ fontSize: '1.1em', lineHeight: '1.6' }}>
        What started as a personal love for collecting British antiques has grown into a treasure trove for fellow collectors, decorators, and history enthusiasts. Whether it’s an 18th-century English writing desk, a vintage pocket watch from London, or an exquisite piece of early English porcelain, our collection showcases the finest examples of British antique craftsmanship.
      </p>

      <p style={{ fontSize: '1.1em', lineHeight: '1.6' }}>
        At Stokes Antiques, we don’t just sell objects—we preserve history. Every piece is maintained with the utmost care, ensuring that the stories of the past continue to inspire and be appreciated for generations to come.
      </p>

      <p style={{ fontSize: '1.1em', lineHeight: '1.6' }}>
        Whether you're searching for a statement piece to complete your home, starting a collection, or simply fascinated by British history, we invite you to explore the rich heritage of our carefully curated collection.
      </p>
    </div>
  );
};

export default AboutPage;
