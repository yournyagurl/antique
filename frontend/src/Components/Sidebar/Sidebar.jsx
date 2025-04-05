import React from 'react'
import './Sidebar.css'
import { NavLink } from 'react-router-dom'
import { assets } from '../../assets/assets'



const Sidebar = () => {
  return (
    <div className='sidebar'>
        <div className="sidebar-items">
        <NavLink to={'/add'} style={{textDecoration: 'none'}}>
        <div className="sidebar-item">
            <img src={assets.upload} alt="" />
            <p>Add Product</p>
        </div>
        </NavLink>
        <NavLink to={'/list'} style={{textDecoration: 'none'}}>
        <div className="sidebar-item">
            <img src={assets.list} alt="" />
            <p>Product List</p>
        </div>
        </NavLink>
        <NavLink to={'/orders'} style={{textDecoration: 'none'}}> 
        <div className="sidebar-item">
            <img src={assets.order_icon} alt="" />
            <p>Orders</p>
        </div>
        </NavLink>
        <NavLink to={'/completeorders'} style={{textDecoration: 'none'}}>
        <div className="sidebar-item">
            <img src={assets.past_orders} alt="" />
            <p>Past Orders</p>
        </div>
        </NavLink>
        </div>
    </div>
  )
}

export default Sidebar