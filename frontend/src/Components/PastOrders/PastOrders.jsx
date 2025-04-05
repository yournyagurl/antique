import React from 'react';
import './PastOrders.css';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { assets } from '../../assets/assets';

const PastOrders = () => {
  const [orders, setOrders] = React.useState([]);

  // Fetch all completed orders
  const fetchCompletedOrders = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/orders/listorders');
      if (response.data.success) {
        // Filter completed orders
        const completedOrders = response.data.data.filter(order => order.status === 'complete');
        setOrders(completedOrders);
      } else {
        toast.error("Error fetching completed orders");
      }
    } catch (error) {
      console.error("Error fetching completed orders:", error);
      toast.error("Error fetching completed orders");
    }
  };

  // Fetch orders on initial load
  React.useEffect(() => {
    fetchCompletedOrders();
  }, []);

  return (
    <div>
      <div className="order-add">
        <h3>PAST ORDERS</h3>
        <div className="order-list">
          {orders.map((order, index) => (
            <div className="order-item" key={index}>
              <img src={assets.orders} alt="" />
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
              <p>£{order.amount}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PastOrders;
