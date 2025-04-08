import React, { useState } from 'react';
import { useCartStore } from '../../stores/useCartStore';
import axios from '../../lib/axios'; // Assuming your axios instance is configured here
import './placeOrder.css';

const CheckoutPage = () => {
    const { cart, getTotalCartAmount, getTotalShippingFee, total } = useCartStore();
    const clearCart = useCartStore((state) => state.clearCart);
    const [shippingInfo, setShippingInfo] = useState({
        firstName: '',
        lastName: '',
        email: '',
        address: '',
        city: '',
        postcode: '',
        country: 'UK',
        phoneNumber: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setShippingInfo(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleCheckout = async () => {
        setLoading(true);
        setError('');

        const orderData = {
            products: cart.map(item => ({
                product: item._id,
                quantity: item.quantity,
            })),
            shippingInfo: shippingInfo,
            totalAmount: getTotalCartAmount() + getTotalShippingFee()
        };

        try {
            const response = await axios.post('/payment/place-order', orderData, {
                headers: {
                    'Content-Type': 'application/json',
                    // You might have default headers configured in your axios instance
                    // 'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                },
            });

            if (response.status !== 200) {
                throw new Error(response.data?.message || 'Failed to create checkout session');
            }

            const { url } = response.data;
            window.location.href = url;
            clearCart();
        } catch (err) {
            console.error('Checkout error:', err);
            setError(err.response?.data?.message || err.message || 'An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="checkout-page">
            <h2 className="checkout-title">Checkout</h2>
            {error && <p className="checkout-error">Error: {error}</p>}

            <div className="shipping-info-section">
                <h3 className="shipping-info-title">Shipping Information</h3>
                <form className="shipping-info-form">
                    <div className="form-group">
                        <label htmlFor="firstName">First Name:</label>
                        <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            value={shippingInfo.firstName}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="lastName">Last Name:</label>
                        <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            value={shippingInfo.lastName}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={shippingInfo.email}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="address">Address:</label>
                        <input
                            type="text"
                            id="address"
                            name="address"
                            value={shippingInfo.address}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="city">City:</label>
                        <input
                            type="text"
                            id="city"
                            name="city"
                            value={shippingInfo.city}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="postcode">Postcode:</label>
                        <input
                            type="text"
                            id="postcode"
                            name="postcode"
                            value={shippingInfo.postcode}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="country">Country:</label>
                        <input
                            type="text"
                            id="country"
                            name="country"
                            value={shippingInfo.country}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="phoneNumber">Phone Number:</label>
                        <input
                            type="tel"
                            id="phoneNumber"
                            name="phoneNumber"
                            value={shippingInfo.phoneNumber}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                </form>
            </div>

            <div className="order-summary-section">
                <h3 className="order-summary-title">Order Summary</h3>
                <ul className="order-summary-list">
                    {cart.map(item => (
                        <li key={item._id} className="order-summary-item">
                            <span className="item-name">{item.name}</span>
                            <span className="item-quantity">x {item.quantity}</span>
                            <span className="item-price">£{(item.price * item.quantity).toFixed(2)}</span>
                        </li>
                    ))}
                </ul>
                <div className="summary-totals">
                    <p className="shipping-fee">Shipping Fee: £{getTotalShippingFee().toFixed(2)}</p>
                    <p className="total-amount">Total: £{total.toFixed(2)}</p>
                </div>
                <button
                    onClick={handleCheckout}
                    disabled={loading}
                    className={`checkout-button ${loading ? 'checkout-button--loading' : ''}`}
                >
                    {loading ? 'Processing...' : 'Proceed to Checkout'}
                </button>
            </div>
        </div>
    );
};

export default CheckoutPage;