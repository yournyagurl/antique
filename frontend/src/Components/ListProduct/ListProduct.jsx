import React from 'react'
import { useProductStore } from '../../stores/useProductStore';
import { assets } from '../../assets/assets';
import './ListProduct.css'
const ListProduct = () => {

    const { products, deleteProduct } = useProductStore();


  return (
    <div className='listproduct'>
            <h1>ALL PRODUCTS</h1>
            <div className="listproduct-format-main">
                <h3>Products</h3>
                <h3>Title</h3>
                <h3>Price</h3>
                <h3>Category</h3>
                <h3>Remove</h3>
            </div>
            <div className="listproduct-allproducts">
                <hr />
                {products.length > 0 ? (
                    products.map((product) => (
                        <div className="listproduct-format-main listproduct-format" key={product._id}>
                            <img src={product.image[0]} alt={product.name} className='listproduct-image'/>
                            <p>{product.name}</p>
                            <p>£{product.price}</p>
                            <p>{product.category}</p>
                            <img 
                                onClick={() => deleteProduct(product._id)} 
                                src={assets.deleteIcon} 
                                className='listproduct-remove' 
                                alt="Remove" 
                            />
                        </div>
                    ))
                ) : (
                    <p>No products available or failed to fetch.</p>
                )}
            </div>
        </div>
  )
}

export default ListProduct