import React, { useState, useEffect } from 'react';
import axios from '../../lib/axios'; // Assuming your axios instance
import { Link } from 'react-router-dom'; // For navigation
import './myOrders.css';
import { useProductStore } from '../../stores/useProductStore';

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(true);
    const [errorOrders, setErrorOrders] = useState('');
    const { products, fetchAllProducts, loading: loadingProducts } = useProductStore();

    useEffect(() => {
        const fetchUserOrders = async () => {
            setLoadingOrders(true);
            setErrorOrders('');
            try {
                const response = await axios.get('/payment/myorder', {
                    headers: {
                        // Include your authentication token
                    },
                });
                setOrders(response.data);
                setLoadingOrders(false);
            } catch (err) {
                setErrorOrders(err.response?.data?.message || 'Failed to fetch your orders.');
                setLoadingOrders(false);
            }
        };

        fetchUserOrders();

        // Ensure all products are fetched for name lookup
        if (products.length === 0 && !loadingProducts) {
            fetchAllProducts();
        }
    }, [fetchAllProducts, loadingProducts]);

    if (loadingOrders || loadingProducts) {
        return <div>Loading your order history and product details...</div>;
    }

    if (errorOrders) {
        return <div className="error-message">Error: {errorOrders}</div>;
    }

    if (orders.length === 0) {
        return <div>You haven't placed any orders yet.</div>;
    }

    const getProductName = (productId) => {
        const product = products.find((p) => p._id === productId);
        return product ? product.name : 'Product Not Found';
    };

    return (
        <div className="user-orders-container">
            <h2>Your Order History</h2>
            {orders.map((order) => (
                <div key={order._id} className="order-summary-card">
                    <div className="order-header-summary">
                        <div className="order-info-summary">
                        <p className="order-number">Order #{order._id.slice(-8)}</p>
                           
                            <p>Total Amount: £{order.totalAmount}</p>
                            <p>Ship To: {order.shippingInfo?.city}, {order.shippingInfo?.country}</p>
                        </div>
                        <div className="order-actions-summary">
                        <p>Order Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                        <p>Order Status: {order.status}</p>
                        </div>
                    </div>

                    {order.deliveredAt && (
                        <div className="delivery-info">
                            Delivered {new Date(order.deliveredAt).toLocaleDateString()}
                        </div>
                    )}

                    <div className="order-items">
                        {order.products.map((item) => (
                            <div key={item._id} className="order-item-details">
                                {/* Assuming your backend returns an image URL in item.product.image */}
                                {item.product?.image && (
                                    <img src={item.product.image} alt={getProductName(item.product)} className="product-thumbnail" />
                                )}
                                <div className="product-details">
                                    <h4 className="product-name">{getProductName(item.product)}</h4>
                                    <p className="product-price">Price: £{item.price}</p>
                                    {/* Add return/replace info if available in your data */}
                                    {/* <p className="return-info">Return or Replace items: Eligible through ...</p> */}
                                    <div className="product-actions">
                                    
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default MyOrders;