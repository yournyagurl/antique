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
      <div className="admin-tab-container">
        <ul className="admin-tab-menu">
          <li onClick={() => changeTab('addproducts')} className={`admin-tab-button ${activeTab === 'addproducts' ? 'active' : ''}`}>
            ADD PRODUCTS
          </li>
          <li onClick={() => changeTab('list')} className={`admin-tab-button ${activeTab === 'list' ? 'active' : ''}`}>
            LIST PRODUCTS
          </li>
          <li onClick={() => changeTab('pending')} className={`admin-tab-button ${activeTab === 'pending' ? 'active' : ''}`}>
            PENDING
          </li>
          <li onClick={() => changeTab('completed')} className={`admin-tab-button ${activeTab === 'completed' ? 'active' : ''}`}>
            COMPLETED
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
