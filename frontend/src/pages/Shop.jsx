import React, { useEffect } from 'react';
import './css/shop.css';
import Item from '../Components/Item/Item';
import { useProductStore } from '../stores/useProductStore';

const Shop = (props) => {
  const { fetchAllProducts, products: allProducts } = useProductStore();

  // Fetch products when the component mounts
  useEffect(() => {
    fetchAllProducts();
  }, [fetchAllProducts]);

  // Check if allProducts is not an array, which may occur before data is fetched
  if (!Array.isArray(allProducts)) {
    return <div>LOADING OR NO PRODUCTS AVAILABLE</div>;
  }

  // Filter products based on category if provided
  const filteredProducts = props.category
    ? allProducts.filter((item) => item.category.toLowerCase() === props.category.toLowerCase())
    : allProducts;

  return (
    <div className="shop-category">
      <div className="shopcategory-items">
        {filteredProducts.map((item) => (
          <div key={item._id} className="item-container">
            <Item
              id={item._id}  // Pass id prop to Item
              image={item.image && item.image.length > 0 ? item.image[0] : 'default-image.jpg'}
              name={item.name}
              price={item.price}
            />
          </div>
        ))}
      </div>
      <div className="shopcategory-loadmore">
        EXPLORE MORE
      </div>
    </div>
  );
};

export default Shop;
