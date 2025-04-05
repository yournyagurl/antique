import React, { useState } from 'react';
import './ProductDisplay.css';
import toast from 'react-hot-toast';
import { userUserStore } from '../../stores/useUserStore';
import { useEmailStore } from '../../stores/useEmailStore';
import { useCartStore } from '../../stores/useCartStore';
import { useProductStore } from '../../stores/useProductStore';
import { useParams } from 'react-router-dom';

const ProductDisplay = () => {
  const { productId } = useParams();
  const { products } = useProductStore();
  const { user } = userUserStore();
  const { addToCart, cart } = useCartStore();
  const [activeSection, setActiveSection] = useState('details');
  const { sendEnquiry } = useEmailStore();

  const product = products.find((p) => p._id === productId);

  const handleSubmitEnquiry = async () => {
    const enquiryWithProduct = {
      ...enquiryData,
      productId: product._id,
    };
  
    const result = await sendEnquiry(enquiryWithProduct);
    if (result.success) {
      toast.success('Enquiry submitted successfully!');
      setEnquiryData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        postcode: '',
        message: '',
      });
      setActiveSection('details');
    } else {
      toast.error(result.message);
    }
  };
  

  // Enquiry form logic
  const [enquiryData, setEnquiryData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    postcode: '',
    message: '',
  });

  const handleEnquiryChange = (e) => {
    const { name, value } = e.target;
    setEnquiryData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddToCart = () => {
    if (!user) {
      toast.error('Please login to add products to cart!');
      return;
    }
    addToCart(product);
    toast.success('Product added to cart!');
  };

  // Check if product is loaded
  if (!product) {
    return <div>Loading...</div>; // Display loading state if no product is available
  }

  return (
    <div className="productdisplay">
    {/* Left Section: Product Images */}
    <div className="productdisplay-left">
      <div className="productimage-img-list">
        {product?.image && product.image.length > 0 ? (
          product.image.map((image, index) =>
            image ? (
              <img key={index} src={image} className="productimage-img" alt={`Product ${index + 1}`} />
            ) : null
          )
        ) : (
          <p>No images available</p> // Fallback message if no images exist
        )}
      </div>
      <div className="productdisplay-img">
        <img
          className="productdisplay-main-img"
          src={product?.image && product.image[0] ? product.image[0] : 'path/to/placeholder-image.jpg'}
          alt="Product main"
        />
      </div>
    </div>
  
    {/* Right Section: Product Details */}
    <div className="productdisplay-right">
      <div className="productdisplay-right-top">
        <h1>{product.name || 'No name available'}</h1>
      </div>
  
      {/* Section Navigation */}
      <div className="detailsbox-navigator">
        <button
          className={`detailsbox-nav-box ${activeSection === 'details' ? 'active' : ''}`}
          onClick={() => setActiveSection('details')}
        >
          DETAILS
        </button>
        <button
          className={`detailsbox-nav-box-fade ${activeSection === 'enquiry' ? 'active' : ''}`}
          onClick={() => setActiveSection('enquiry')}
        >
          ENQUIRE
        </button>
      </div>
  
      {/* Content Based on Active Section */}
      <div className="detailsbox-details">
        {activeSection === 'details' && (
          <div>
            <p className="productdescription">{product.description || 'No description available'}</p>
            <p className="productcategory">
              <strong>Category: </strong>{product.category || 'No category available'}
            </p>
          </div>
        )}
  
        {activeSection === 'enquiry' && (
          <div className="enquiry-box">
            <h3>Enquiry Form</h3>
            <div className="enquiry-line">
              <input type="text" name="firstName" placeholder="First Name" className="enquiry-input" onChange={handleEnquiryChange} />
              <input type="text" name="lastName" placeholder="Last Name" className="enquiry-input" onChange={handleEnquiryChange} />
              <input type="email" name="email" placeholder="Email" className="enquiry-input" onChange={handleEnquiryChange} />
              <input type="tel" name="phone" placeholder="Phone" className="enquiry-input" onChange={handleEnquiryChange} />
              <input type="text" name="postcode" placeholder="Postcode" className="enquiry-input" onChange={handleEnquiryChange} />
              <textarea name="message" placeholder="Message" className="enquiry-input" onChange={handleEnquiryChange}></textarea>
            </div>
            <button className="submit-btn" onClick={handleSubmitEnquiry}>Submit</button>
            <button className="cancel-btn" onClick={() => setActiveSection('details')}>Cancel</button>
          </div>
        )}
      </div>
  
      <div className="productdisplay-right-middle">
        <div className="productprice">£{product.price || 'N/A'}</div>
      </div>
  
      {/* Add to Cart Button */}
      <div className="productdisplay-right-bottom">
        <button
          onClick={handleAddToCart}
          disabled={cart.some(item => item._id === product._id)}
          style={{
            cursor: cart.some(item => item._id === product._id) ? 'not-allowed' : 'pointer',
            opacity: cart.some(item => item._id === product._id) ? 0.6 : 1,
          }}
        >
          {cart.some(item => item._id === product._id) ? 'ADDED' : 'ADD TO CART'}
        </button>
      </div>
    </div>
  </div>
  
  );
};

export default ProductDisplay;
