import React, { useState, useEffect } from 'react';
import axios from '../../lib/axios';
import { useProductStore } from '../../stores/useProductStore';
import { useCartStore } from '../../stores/useCartStore';
import './userOrders.css';
import toast from 'react-hot-toast';

const OrderConfirmation = () => {
  const [latestOrder, setLatestOrder] = useState(null);
  const [loadingOrder, setLoadingOrder] = useState(true);
  const [errorOrder, setErrorOrder] = useState(null);
  const { clearCart } = useCartStore();
  const { products, fetchAllProducts, loading: loadingProducts } = useProductStore();

  useEffect(() => {
    fetchAllProducts(); // Call fetchAllProducts when the component mounts
  }, [fetchAllProducts]);

  useEffect(() => {
    clearCart(); // Clear the cart on this page load as it's the confirmation

    const fetchLatestUserOrder = async () => {
      setLoadingOrder(true);
      setErrorOrder(null);
      try {
        const response = await axios.get('/payment/myorder');
        if (response.data && response.data.length > 0) {
          setLatestOrder(response.data[0]);
        } else {
          setLatestOrder(null);
        }
        setLoadingOrder(false);
      } catch (err) {
        if (err.response?.status === 401) {
          toast.error('Please log in to view your orders.');
        } else {
          setErrorOrder(err.message || 'Failed to fetch latest order');
        }
        setLoadingOrder(false);
      }
    };
  
    fetchLatestUserOrder();
  }, [clearCart]);

  const getProductName = (productId) => {
    const product = products.find((p) => p._id === productId);
    return product ? product.name : 'Loading...';
  };

  if (loadingOrder || loadingProducts) {
    return <div>Loading...</div>;
  }

  if (errorOrder) {
    return <div>Error fetching order: {errorOrder}</div>;
  }

  if (!latestOrder) {
    return <div>No orders found.</div>;
  }

  return (
    <div className="order-confirmation-container">
      <h2>Order Confirmed!</h2>
      <div>
        <h3>Order Details</h3>
        <p><strong>Order Date:</strong> {new Date(latestOrder.createdAt).toLocaleDateString()} {new Date(latestOrder.createdAt).toLocaleTimeString()}</p>
        <p><strong>Status:</strong> {latestOrder.status}</p>
  
        <h4>Products:</h4>
        <ul className="products-list">
          {latestOrder.products.map((item) => (
            <li key={item.product}>
              <div><strong>Product:</strong> {getProductName(item.product)}</div>
              <div><strong>Price:</strong> £{item.price.toFixed(2)}</div>
            </li>
          ))}
        </ul>
  
        <p className="total-amount">Total: £{latestOrder.totalAmount.toFixed(2)}</p>
  
        <p><strong>Shipping Address:</strong></p>
        <pre className="shipping-info">{JSON.stringify(latestOrder.shippingInfo, null, 2)}</pre>
  
        <hr className="divider" />
  
        <p style={{ marginTop: '1rem' }}>
          Thank you for your purchase! We’ll notify you when your order is on the way.
        </p>
      </div>
    </div>
  );
  
};

export default OrderConfirmation;