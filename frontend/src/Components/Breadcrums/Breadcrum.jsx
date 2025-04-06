import React from 'react';
import './Breadcrum.css';
import { assets } from '../../assets/assets';
import { useProductStore } from '../../stores/useProductStore';
import { useParams } from 'react-router-dom';

const Breadcrum = () => {
  const { productId } = useParams(); // Get the productId from the URL params
  const { products } = useProductStore(); // Fetch products from the store
  
  // Find the product based on productId
  const product = products.find(p => p._id === productId);
  
  // Check if the product exists before rendering
  if (!product) {
    return <div>Loading...</div>; // Product not found, show loading or error
  }

  const { category, name } = product;

  return (
    <div className="breadcrums">
      HOME <img src={assets.arrow_icon} alt="arrow icon" /> INVENTORY <img src={assets.arrow_icon} alt="arrow icon" />
      {category ?? 'Category Not Available'}
      <img src={assets.arrow_icon} alt="arrow icon" />
      {name ?? 'Product Name Not Available'}
    </div>
  );
};

export default Breadcrum;
