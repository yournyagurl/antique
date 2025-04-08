import React, { useState, useEffect } from 'react';
import axios from '../../lib/axios';
import { toast } from 'react-hot-toast';
import { assets } from '../../assets/assets'; // Assuming you have an assets file

const pastOrders = () => {
    const [completedOrders, setCompletedOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchCompletedOrders = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await axios.get('/payment/getallorders');
            if (response.status === 200) {
                const completed = response.data.filter(order => order.status === 'completed');
                setCompletedOrders(completed);
            } else {
                toast.error("Error fetching completed orders");
                setError("Error fetching completed orders");
            }
        } catch (error) {
            console.error("Error fetching completed orders:", error);
            toast.error("Error fetching completed orders");
            setError("Error fetching completed orders");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCompletedOrders();
    }, []);

    if (loading) {
        return <div>Loading completed orders...</div>;
    }

    if (error) {
        return <div className="error-message">Error: {error}</div>;
    }

    return (
        <div className="completed-orders-container">
            <div className="order-list-container">
                <h3>COMPLETED ORDERS</h3>
                <div className="order-list">
                    {completedOrders.length === 0 ? (
                        <p>No completed orders found.</p>
                    ) : (
                        completedOrders.map((order) => (
                            <div className="order-item" key={order._id}>
                                <div className="order-details">
                                    <p className="order-item-product">
                                        {order.products?.map((item, index) => (
                                            <span key={index}>
                                                {item.product?.name}
                                                {index < order.products.length - 1 && ', '}
                                            </span>
                                        ))}
                                    </p>
                                    <p className="order-item-name">
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
                                <div className="order-meta">
                                    <p>Items: {order.products?.length || 0}</p>
                                    <p>Order Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                                    <p>Completed On: {new Date(order.updatedAt).toLocaleDateString()}</p> {/* Assuming updatedAt is the completion time */}
                                    <p className="order-total">Total: £{order.totalAmount}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default pastOrders;