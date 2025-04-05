import React from 'react';
import './Breadcrum.css';
import { assets } from '../../assets/assets';

const Breadcrum = (props) => {
  const { product } = props;

  // Check if the product exists before rendering
  if (!product) {
    return <div>Loading...</div>; // You can also show a loading state or an error message
  }

  return (
    <div className='breadcrums'>
      HOME <img src={assets.arrow_icon} alt="" /> INVENTORY <img src={assets.arrow_icon} alt="" />
      {product.category ? product.category : 'Category Not Available'} 
      <img src={assets.arrow_icon} alt="" />
      {product.name ? product.name : 'Product Name Not Available'}
    </div>
  );
};

export default Breadcrum;
