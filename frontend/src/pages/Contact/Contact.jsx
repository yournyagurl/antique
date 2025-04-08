import React from 'react';
import './Contact.css';

const ContactPage = () => {
  return (
    <div className="contact-page">
      <h1 style={{ textAlign: 'left', color: '#fef2c3' }}>Contact Us</h1>

      <div className="contact-container">
        <div className="contact-info">
          <h2>Store Location</h2>
          <p>
            <strong>Stokes Antiques & Collectibles</strong>
          </p>
          <p>123 Antique Lane, London, UK</p>
          <p>Postal Code: AB12 3CD</p>

          <h2>Contact Information</h2>
          <p>
            <strong>Phone:</strong> +44 1234 567890
          </p>
          <p>
            <strong>Email:</strong> <a href="mailto:info@stokesantiques.com">info@stokesantiques.com</a>
          </p>
          
          <h2>Business Hours</h2>
          <p>Monday - Friday: 9:00 AM - 5:00 PM</p>
          <p>Saturday: 10:00 AM - 4:00 PM</p>
          <p>Sunday: Closed</p>
        </div>

        <div className="map-container">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2391.688674974355!2d-3.0714732999999996!3d53.1696251!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x487ac5573128a3d9%3A0x74d24a1a7220d77!2sMaxwell%20Cl%2C%20Buckley%20CH7%203JF!5e0!3m2!1sen!2suk!4v1744111631645!5m2!1sen!2suk"
            width="600"
            height="450"
            style={{ border: '0', width: '100%', height: '100%' }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
