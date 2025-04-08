import React, { useState, useEffect } from 'react';
import axios from '../../lib/axios'; // Assuming your axios instance
import { Link } from 'react-router-dom'; // If you want to link to order details
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
                        // Include your authentication token here if required by your backend
                        // 'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                    },
                });
                setOrders(response.data);
                setLoadingOrders(false);
            } catch (err) {
                setErrorOrders(err.response?.data?.message || 'Failed to fetch your orders.');
                setLoadingOrders(false);
            }
        };

        // Fetch user orders
        fetchUserOrders();

        // Ensure all products are fetched for name lookup
        if (products.length === 0 && !loadingProducts) {
            fetchAllProducts();
        }
    }, [fetchAllProducts, loadingProducts]); // Depend on fetchAllProducts to re-run if needed

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
        return product ? product.name : 'Product Not Found'; // Handle case where product might be deleted
    };

    return (
        <div className="user-orders-container">
            <h2>Your Order History</h2>
            {orders.map((order) => (
                <div key={order._id} className="order-item">
                    <div className='Order-Top'>
                        <div className='Order-id-and-date'>
                            <h4>Order ID: #{order._id.slice(-6)}</h4>
                            <p>Order Date: {new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString()}</p>
                        </div>
                        <div className='Order-Status'>
                            <p>Status: {order.status}</p>
                        </div>
                    </div>
                    <hr />
                    <div className='Order-Products'>
                        <h4>Products:</h4>
                        <ul>
                            {order.products.map((item) => (
                                <li key={item._id}>
                                    {getProductName(item.product)} - Price: £{item.price}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className='Order-Total'>
                        <h4>Total: £{order.totalAmount}</h4>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default MyOrders;