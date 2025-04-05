import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Navbar from './Components/Navbar/Navbar';
import LoginPopup from './Components/loginPopup/loginPopup'; 
import { Toaster } from 'react-hot-toast';
import Footer from './Components/Footer/Footer';
import { userUserStore } from './stores/useUserStore';
import Admin from './pages/Admin';
import { Navigate } from 'react-router-dom';

function App() {
  const [showLogin, setShowLogin] = useState(false);
  const user = userUserStore()

  return (
    <>
      {/* Conditionally render LoginPopup based on state */}
      {showLogin && <LoginPopup setShowLogin={setShowLogin} />}
      
      <div className="App">
        {/* Pass setShowLogin down to Navbar to control the popup */}
        <Navbar setShowLogin={setShowLogin} />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPopup />} />
          <Route path='/secret-dashboard' element = {user?.role === "admin" ? <Admin/> : <Navigate to="/login"/>} />
        </Routes>
        <Footer />
      </div>
      <Toaster />
    </>
  );
}

export default App;
