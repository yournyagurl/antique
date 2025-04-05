import React from 'react';
import './Item.css';
import { Link } from 'react-router-dom';

export const Item = ({ id, image, name, price }) => {
  return (
    <div className="item">
      {/* Wrapping the whole item with Link to handle navigation */}
      <Link to={id ? `/product/${id}` : '#'} className="item-link" onClick={() => window.scrollTo(0, 0)}>
        <img src={image || 'default-image.jpg'} alt={name || 'Product'} />
      </Link>

      <div className="item-info">
        <p>{name || 'Unnamed Product'}</p>

        <div className="item-prices">
          <div className="item-price-new">£{price ? price.toFixed(2) : 'N/A'}</div>
        </div>
      </div>
    </div>
  );
};

export default Item;
