import React, { useEffect, useState } from 'react';
import './css/Admin.css';
import { Link } from 'react-router-dom';
import AddProduct from '../Components/AddProduct/AddProduct';
import ListProduct from '../Components/ListProduct/ListProduct';
import CurrentOrders from '../Components/CurrentOrders/CurrentOrders';
import PastOrders from '../Components/PastOrders/PastOrders';
import { useProductStore } from '../stores/useProductStore';


const Admin = () => {
  const [activeTab, setActiveTab] = useState('addproducts');
  const {fetchAllProducts } = useProductStore();

  useEffect(() => {
    fetchAllProducts();
  }, [fetchAllProducts]);


  const changeTab = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div>


      {/* Navigation Tabs */}
      import { Link } from 'react-router-dom';

<div className="admin-tab-container">
  <ul className="admin-tab-menu">
    <li className={`admin-tab-button ${activeTab === 'addproducts' ? 'active' : ''}`}>
      <Link to="/admin/addproducts">ADD PRODUCTS</Link>
    </li>
    <li className={`admin-tab-button ${activeTab === 'list' ? 'active' : ''}`}>
      <Link to="/admin/list">LIST PRODUCTS</Link>
    </li>
    <li className={`admin-tab-button ${activeTab === 'pending' ? 'active' : ''}`}>
      <Link to="/admin/pending">PENDING</Link>
    </li>
    <li className={`admin-tab-button ${activeTab === 'completed' ? 'active' : ''}`}>
      <Link to="/admin/completed">COMPLETED</Link>
    </li>
  </ul>
</div>


      {/* Content Area for Displaying Components Based on Active Tab */}
      <div className="admin-content">
        {activeTab === 'addproducts' && <AddProduct />}
        {activeTab === 'list' && <ListProduct />}
        {activeTab === 'pending' && <CurrentOrders />}
        {activeTab === 'completed' && <PastOrders />}
      </div>
    </div>
  );
};

export default Admin;
