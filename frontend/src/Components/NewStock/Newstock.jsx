import React, { useEffect } from 'react';
import './Newstock.css';
import { useNavigate } from 'react-router-dom';
import { useProductStore } from '../../stores/useProductStore';
import Item from '../Item/Item';

const Newstock = () => {
  // Destructure newCollection, products, loading, and error from the store
  const { newCollection, products, loading, error } = useProductStore();

  const navigate = useNavigate();

  // Fetch new collection when component mounts
  useEffect(() => {
    newCollection(); // Call the action to fetch products
  }, [newCollection]);

  // Handle item click to navigate to the product details page
  const handleItemClick = (id) => {
    navigate(`/product/${id}`); // Navigate to the product page
  };

  // Handle loading and error states
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>; // Show error message if there is an error
  }

  return (
    <div className="new-item">
      <h1>LATEST ARRIVALS</h1>
      <hr />
      <div className="new-prod">
        {/* Map over products array and render each product */}
        {products.map((item) => (
          <div
            className="Item"
            key={item._id}
            onClick={() => handleItemClick(item._id)} // Navigate on click
          >
            <Item
              image={item.image && item.image.length > 0 ? item.image[0] : 'default_image_url'}
              name={item.name}
              price={item.price}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Newstock;
