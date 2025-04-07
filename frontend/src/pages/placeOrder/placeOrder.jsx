import React, { useState } from 'react';
import { useCartStore } from '../../stores/useCartStore';
import axios from '../../lib/axios'; // Assuming your axios instance is configured here

const CheckoutPage = () => {
    const cart = useCartStore((state) => state.cart);
    const total = useCartStore((state) => state.total);
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
            totalAmount: total,
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
        } catch (err) {
            console.error('Checkout error:', err);
            setError(err.response?.data?.message || err.message || 'An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>Checkout</h2>
            {error && <p style={{ color: 'red' }}>Error: {error}</p>}
            <h3>Shipping Information</h3>
            <form>
                <div>
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
                <div>
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
                <div>
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
                <div>
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
                <div>
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
                <div>
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
                <div>
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
                <div>
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

            <h3>Order Summary</h3>
            <ul>
                {cart.map(item => (
                    <li key={item._id}>
                        {item.name} x {item.quantity} - £{(item.price * item.quantity).toFixed(2)}
                    </li>
                ))}
            </ul>
            <p>Total: £{total.toFixed(2)}</p>
            <button onClick={handleCheckout} disabled={loading}>
                {loading ? 'Processing...' : 'Proceed to Checkout'}
            </button>
        </div>
    );
};

export default CheckoutPage;