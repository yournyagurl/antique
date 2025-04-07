import React, { useEffect, useState } from 'react';
import { useCartStore } from '../../stores/useCartStore';
import './Cart.css';
import { assets } from '../../assets/assets';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const { cart, removeFromCart, getTotalCartAmount, getTotalShippingFee, getCartItems } = useCartStore();
  const [paymentError] = useState(null);

  const isCartEmpty = cart.length === 0;

  useEffect(() => {
    const fetchCartItems = async () => {
      await getCartItems();
    };
    fetchCartItems();
  }, [getCartItems]);

  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!isCartEmpty) {
      navigate('/order');
    }
  };

  return (
    <div className="cart-item-container">
      {isCartEmpty ? (
        <div className="cart-empty">
          <h1>Your Cart is Empty 🛒</h1>
          <p>Looks like you haven't added any items yet.</p>
        </div>
      ) : (
        <div className="cart-item-main">
          <div className="cart-item-left">
            <div className="cartitems-format-main">
              <p>Remove</p>
              <p>Products</p>
              <p>Title</p>
              <p>Price</p>
            </div>
            <hr />
            {cart.map((item) => (
              <div key={item._id}>
                <div className="cartitems-format cartitems-format-main">
                  <img 
                    className="cartitem-remove-icon" 
                    src={assets.deleteIcon} 
                    onClick={() => removeFromCart(item._id)} 
                    alt="Remove" 
                  />
                  <img 
                    src={item.image?.[0] || 'default-image.jpg'} 
                    alt={item.name || 'Product'} 
                    className="cartitem-format-img" 
                  />
                  <p>{item.name}</p>
                  <p>£{item.price}</p>
                </div>
                <hr />
              </div>
            ))}
          </div>

          <div className="cart-item-right">
            <div className="cartitems-total">
              <h1>CART TOTAL</h1>
              <div>
                <div className="cartitems-total-item">
                  <p>SUBTOTAL</p>
                  <p>£{getTotalCartAmount()}</p>
                </div>
                <hr />
                <div className="cartitems-total-item">
                  <p>SHIPPING FEE</p>
                  <p>£{getTotalShippingFee()}</p>
                </div>
                <hr />
                <div className="cartitems-total-item">
                  <p>TOTAL</p>
                  <h3>£{getTotalCartAmount() + getTotalShippingFee()}</h3>
                </div>
              </div>
              <button 
                onClick={handleCheckout} 
                disabled={isCartEmpty}
                className={isCartEmpty ? 'disabled-button' : ''}>
                CHECKOUT
              </button>
              {paymentError && <div className="error-message">{paymentError}</div>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
