import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Navbar from './Components/Navbar/Navbar';
import LoginPopup from './Components/loginPopup/loginPopup'; 
import { Toaster } from 'react-hot-toast';
import Footer from './Components/Footer/Footer';
import { useUserStore } from './stores/useUserStore';
import Admin from './pages/Admin';
import { Navigate } from 'react-router-dom';
import AddProduct from './Components/AddProduct/AddProduct';
import Shop from './pages/Shop';
import Product from './pages/Product';
import Cart from './pages/Cart/Cart';
import { useCartStore } from './stores/useCartStore';
import PlaceOrder from './pages/placeOrder/placeOrder';
import OrderConfirmation from './pages/UserOrders/OrderConfirmation';
import MyOrders from './pages/myOrders/myOrders';
import AboutPage from './pages/AboutMe/AboutMe';
import Contact from './pages/Contact/Contact';

function App() {
  const [showLogin, setShowLogin] = useState(false);
  const { user, checkAuth } = useUserStore();
	const { getCartItems } = useCartStore();
	useEffect(() => {
		checkAuth();
	}, [checkAuth]);

	useEffect(() => {
		if (!user) return;

		getCartItems();
	}, [getCartItems, user]);
  


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
          <Route
  path="/secret-dashboard"
  element={
     user?.user?.role === "admin" ? (
      <Admin />
    ) : (
      <Navigate to="/login" />
    )
  }
/>

          <Route path = '/add' element={<AddProduct />} />
          <Route path='/shop' element={<Shop />} />
          <Route path='/shop/furniture' element={<Shop category="Furniture" />} />
          <Route path='/shop/collectibles' element={<Shop category="Collectibles" />} />
          <Route path='/shop/arts' element={<Shop category="arts" />} />
          <Route path='/shop/miscellaneous' element={<Shop category="Miscellaneous" />} />
          <Route path="/product" element={<Product />} /> {/* This can be the product listing page */}
          <Route path="/product/:productId" element={<Product />} /> {/* This will be for the product detail page */}
          <Route path='/cart' element={<Cart />} />
          <Route path='/order' element={<PlaceOrder />} />
          <Route path='/confirmorder' element={<OrderConfirmation />} />
          <Route path="/myorders" element={<MyOrders/>} />
          <Route path="/about" element={<AboutPage />} />
          <Route path='/contact' element={<Contact />} />
        </Routes>
        <Footer />
      </div>
      <Toaster />
    </>
  );
}

export default App;
