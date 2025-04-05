import React, { useState } from 'react';
import './NewsLetter.css';
import { useEmailStore } from '../../stores/useEmailStore';

export const NewsLetter = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(null);
  const { subscribe, loading } = useEmailStore();

  const handleSubscribe = async () => {
    if (!email || !email.includes('@')) {
      setMessage({ type: 'error', text: 'Please enter a valid email address.' });
      return;
    }

    const result = await subscribe(email);

    if (result.success) {
      setMessage({ type: 'success', text: result.message });
      setEmail('');
    } else {
      setMessage({ type: 'error', text: result.message });
    }
  };

  return (
    <div className="newsletter">
      <h1>STAY IN TOUCH</h1>
      <p>SUBSCRIBE TO OUR NEWS LETTER TO GET UPDATES ON NEW STOCK ARRIVALS AND SPECIAL DISCOUNTS!</p>
      
      <div className="newsletter-input-container">
        <input 
          type="email" 
          placeholder="Email Address" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          disabled={loading}
        />
        <button onClick={handleSubscribe} disabled={loading}>
          {loading ? 'Subscribing...' : 'SUBSCRIBE'}
        </button>
      </div>

      {message && (
        <p className={`message ${message.type}`}>{message.text}</p>
      )}
    </div>
  );
};

export default NewsLetter;
