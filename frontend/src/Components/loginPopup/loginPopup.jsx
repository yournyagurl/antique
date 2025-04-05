import React, { useState } from 'react';
import './loginPopup.css';
import { assets } from '../../assets/assets.js'; // Ensure you have the correct assets import
import { userUserStore } from '../../stores/useUserStore.js';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection

const LoginPopup = ({ setShowLogin }) => {
  const [currentView, setCurrentView] = useState('LOGIN');
  const [data, setData] = useState({
    email: '',
    password: '',
    name: '', // This will be used for signup
  });

  const { signup, user, login } = userUserStore();
  const navigate = useNavigate(); // Initialize navigate

  const onChangeHandler = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (currentView === 'LOGIN') {
      // Add your login logic here
      console.log('Logging in with:', data);
      await login(data.email, data.password);
      navigate('/'); // Redirect to homepage
    } else {
      console.log('Signing up with:', data);
      await signup(data.name, data.email, data.password);  // Wait for signup to finish
    }
  };



  return (
    <div className="login-popup">
      <form onSubmit={handleSubmit} className="login-popup-container">
        <div className="login-popup-title">
          <h2>{currentView === 'LOGIN' ? 'LOGIN' : 'SIGN UP'}</h2>
          <img
            onClick={() => navigate('/') } // Close the popup on click
            src={assets.cross}
            alt="Close"
          />
        </div>

        <div className="login-popup-inputs">
          {currentView === 'SIGN UP' && (
            <input
              id="name"
              type="text"
              name="name"
              onChange={onChangeHandler}
              value={data.name}
              placeholder="Name"
              required
            />
          )}
          <input
            id="email"
            type="email"
            name="email"
            onChange={onChangeHandler}
            value={data.email}
            placeholder="Email"
            required
          />
          <input
            id="password"
            type="password"
            name="password"
            onChange={onChangeHandler}
            value={data.password}
            placeholder="Password"
            required
          />
        </div>

        <button type="submit">
          {currentView === 'LOGIN' ? 'LOGIN' : 'CREATE ACCOUNT'}
        </button>

        <div className="login-popup-condition">
          <p>
            By continuing, you agree to our <span>Terms of Use</span> and <span>Privacy Policy.</span>
          </p>
        </div>
      </form>

      <div className="signup-redirect">
        {currentView === 'LOGIN' ? (
          <p>
            Don't have an account? <span onClick={() => setCurrentView('SIGN UP')}>Sign Up Here</span>
          </p>
        ) : (
          <p>
            Already have an account? <span onClick={() => setCurrentView('LOGIN')}>Login Here</span>
          </p>
        )}
      </div>
    </div>
  );
};

export default LoginPopup;
