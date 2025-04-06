import React, { useEffect } from 'react';
import ProductDisplay from '../Components/ProductDisplay/ProductDisplay';
import { useProductStore } from '../stores/useProductStore';
import { useParams } from 'react-router-dom';
import Breadcrum from '../Components/Breadcrums/Breadcrum';

const Product = () => {
  const { newCollection, products } = useProductStore(); // Fetch from store
  const { productId } = useParams();

  // Fetch products when the component mounts
  useEffect(() => {
    if (!products.length) {
      newCollection(); // Fetch the products if not already loaded
    }
  }, [newCollection, products]);

  // Find the product by id
  const product = products ? products.find((e) => String(e._id) === productId) : null;

  // Check if the product was found
  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div>
      <Breadcrum />
      <ProductDisplay product={product} />
    </div>
  );
}

export default Product;
