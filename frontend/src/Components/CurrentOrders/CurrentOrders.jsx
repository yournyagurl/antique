import React from 'react';
import './CurrentOrders.css';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const CurrentOrders = () => {
  const [orders, setOrders] = React.useState([]);

  // Fetch all orders
  const fetchAllOrders = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/orders/listorders');
      if (response.data.success) {
        // Sort the orders by creation date (most recent first)
        const sortedOrders = response.data.data
          .filter(order => order.status === 'pending')  // Only pending orders
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at)); // Sort by date descending
        setOrders(sortedOrders);
      } else {
        toast.error("Error fetching orders");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Error fetching orders");
    }
  };

  // Update order status
  const updateOrderStatus = async (e, orderId) => {
    try {
      const response = await axios.post('http://localhost:4000/api/orders/updatestatus', { orderId, status: e.target.value });
      if (response.data.success) {
        toast.success(response.data.message);
        fetchAllOrders(); // Re-fetch the orders after status update
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
    }
  };

  // Fetch orders on initial load
  React.useEffect(() => {
    fetchAllOrders();
  }, []);

  return (
    <div>
      <div className="order-add">
        <h3>PENDING ORDERS</h3>
        <div className="order-list">
          {orders.map((order, index) => (
            <div className="order-item" key={index}>
              <div>
                <p className='order-item-product'>
                  {order.items.map((item, index) => {
                    return index === order.items.length - 1
                      ? item.name
                      : item.name + ", ";
                  })}
                </p>
                <p className='order-item-name'>
                  {order.address.first_name + " " + order.address.last_name}
                </p>
                <div className="order-item-address">
                  <p>
                    {order.address.street + ", " + order.address.city + ", " + order.address.postcode}
                  </p>
                </div>
                <p>{order.address.phone}</p>
                <p>{order.address.email}</p>
              </div>
              <p>Items: {order.items.length}</p>
              <p>{new Date(order.created_at).toLocaleDateString()}</p>
              <p>£{order.amount}</p>
              <select onChange={(e) => updateOrderStatus(e, order._id)} value={order.status}>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="complete">Complete</option>
              </select>
              
            </div>
            
          ))}
        </div>
      </div>
    </div>
  );
};

export default CurrentOrders;
