import React, { useState, useEffect } from 'react';
import './CurrentOrders.css';
import axios from '../../lib/axios';
import { toast } from 'react-hot-toast';
import './CurrentOrders.css';

const CurrentOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchAllOrders = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await axios.get('/payment/getallorders');
            if (response.status === 200) {
                // Sort the orders by creation date (most recent first)
                const sortedOrders = response.data
                    .filter(order => order.status === 'pending' || order.status === 'shipping') // Only pending and shipping orders
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Sort by date descending
                setOrders(sortedOrders);
            } else {
                toast.error("Error fetching orders");
                setError("Error fetching orders");
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
            toast.error("Error fetching orders");
            setError("Error fetching orders");
        } finally {
            setLoading(false);
        }
    };

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            const response = await axios.post('/payment/updatestatus', { orderId, status: newStatus });
            if (response.status === 200) {
                toast.success(response.data.message || 'Order status updated successfully!');
                // Update the local state to reflect the change without a full re-fetch
                setOrders(prevOrders =>
                    prevOrders.map(order =>
                        order._id === orderId ? { ...order, status: newStatus } : order
                    )
                );
            } else {
                toast.error(response.data.message || 'Failed to update order status.');
                // Optionally, you could re-fetch here to ensure data consistency if the update fails locally
                // fetchAllOrders();
            }
        } catch (error) {
            console.error('Error updating order status:', error);
            toast.error('Failed to update order status');
            // Optionally, you could re-fetch here to ensure data consistency if the update fails locally
            // fetchAllOrders();
        }
    };

    const handleStatusChange = (e, orderId) => {
        const newStatus = e.target.value;
        updateOrderStatus(orderId, newStatus);
    };

    useEffect(() => {
        fetchAllOrders();
    }, []);

    if (loading) {
        return <div>Loading pending orders...</div>;
    }

    if (error) {
        return <div className="error-message">Error: {error}</div>;
    }

    return (
        <div className="current-orders-container">
            <div className="order-add">
                <h3>CURRENT ORDERS</h3>
                <div className="order-list">
                    {orders.length === 0 ? (
                        <p>No current orders found.</p>
                    ) : (
                        orders.map((order, index) => (
                            <div className="order-item" key={order._id}>
                                <div>
                                    <p className='order-item-product'>
                                        {order.products.map((item, idx) => (
                                            <span key={idx}>
                                                {item.product?.name}
                                                {idx < order.products.length - 1 && ', '}
                                            </span>
                                        ))}
                                    </p>
                                    <p className='order-item-name'>
                                        {order.shippingInfo?.firstName} {order.shippingInfo?.lastName}
                                    </p>
                                    <div className="order-item-address">
                                        <p>
                                            {order.shippingInfo?.address}, {order.shippingInfo?.city}, {order.shippingInfo?.postcode}
                                        </p>
                                    </div>
                                    <p>{order.shippingInfo?.phone}</p>
                                    <p>{order.shippingInfo?.email}</p>
                                </div>
                                <p>Items: {order.products.length}</p>
                                <p>{new Date(order.createdAt).toLocaleDateString()}</p>
                                <p>£{order.totalAmount}</p>
                                <select
                                    onChange={(e) => handleStatusChange(e, order._id)}
                                    value={order.status}
                                >
                                    <option value="pending">Pending</option>
                                    <option value="shipping">Shipping</option>
                                    <option value="completed">Complete</option>
                                </select>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default CurrentOrders;