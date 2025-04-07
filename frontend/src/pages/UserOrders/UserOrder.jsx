import React, { useState, useEffect } from 'react';
import axios from '../../lib/axios';
import { useProductStore } from '../../stores/useProductStore';
import { useCartStore } from '../../stores/useCartStore';

const UserOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [errorOrders, setErrorOrders] = useState(null);
  const { clearCart } = useCartStore();
  const { products, fetchAllProducts, loading: loadingProducts } = useProductStore();

  useEffect(() => {
    fetchAllProducts(); // Call fetchAllProducts when the component mounts
  }, [fetchAllProducts]);

  useEffect(() => {

    clearCart();
    const fetchUserOrders = async () => {
      setLoadingOrders(true);
      setErrorOrders(null);
      try {
        const response = await axios.get('/payment/myorder');
        setOrders(response.data);
        setLoadingOrders(false);
      } catch (err) {
        setErrorOrders(err.message || 'Failed to fetch orders');
        setLoadingOrders(false);
      }
    };

    fetchUserOrders();
  }, []);

  const getProductName = (productId) => {
    const product = products.find((p) => p._id === productId);
    return product ? product.name : 'Loading...';
  };

  if (loadingOrders || loadingProducts) {
    return <div>Loading...</div>;
  }

  if (errorOrders) {
    return <div>Error fetching orders: {errorOrders}</div>;
  }

  if (orders.length === 0) {
    return <div>You haven't placed any orders yet.</div>;
  }

  return (
    <div>
      <h2>Your Orders</h2>
      <ul>
        {orders.map((order) => (
          <li key={order._id}>
            <p>Order Date: {new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString()}</p>
            <p>Order Status: {order.status}</p>
            <h4>Products:</h4>
            <ul>
              {order.products.map((item) => (
                <li key={item.product}>
                  Product: {getProductName(item.product)}, Price: £{(item.price).toFixed(2)}
                </li>
              ))}
            </ul>
            <p>Total Amount: £{(order.totalAmount).toFixed(2)}</p>
            <p>Shipping Address:</p>
            <pre>{JSON.stringify(order.shippingInfo, null, 2)}</pre>
            <hr />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserOrders;