import React, { useState } from 'react';
import './AddProduct.css';
import { assets } from '../../assets/assets';
import Sidebar from '../Sidebar/Sidebar';
import { useProductStore } from '../../stores/useProductStore';


const AddProduct = () => {

    const { createProduct } = useProductStore();
    const [images, setImages] = useState([]);
    const [data, setData] = useState({
        name: '',
        description: '',
        category: '',
        price: '',
        deliveryPrice: '',
    });

    const imageHandler = (e) => {
        const files = Array.from(e.target.files);
        setImages(files);
    };

    const changeHandler = (e) => {
        const { name, value } = e.target;
        setData((prevData) => ({ ...prevData, [name]: value }));
    };

    const onSubmitHandler = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('description', data.description);
        formData.append('category', data.category);
        formData.append('price', data.price);
        formData.append('deliveryPrice', data.deliveryPrice);

        images.forEach((image) => formData.append('images', image)); // 'image' should match backend field name



        await createProduct(formData);

    }

    return (
        
        <div className="add-product">
                
            <form className="flex-col" onSubmit={onSubmitHandler}>
                <div className="add-image-upload flex-col">
                    <p>Upload Images</p>
                    <label htmlFor="file-input" className="image-upload-label">
                        <img src={assets.upload} alt="Upload" />
                    </label>
                    <input
                        type="file"
                        id="file-input"
                        name="images"
                        onChange={imageHandler}
                        hidden
                        required
                        multiple
                    />
                    <div className="uploaded-images">
                        {images.map((img, index) => (
                            <img
                                key={index}
                                src={URL.createObjectURL(img)}
                                className="addproduct-thumbnail-img"
                                alt="Product"
                            />
                        ))}
                    </div>
                </div>
                <div className="add-product-name flex-col">
                    <p>Product Name</p>
                    <input
                        type="text"
                        value={data.name}
                        onChange={changeHandler}
                        name="name"
                        placeholder="Product Name"
                        required
                    />
                </div>
                <div className="add-product-description flex-col">
                    <p>Description</p>
                    <textarea
                        value={data.description}
                        onChange={changeHandler}
                        placeholder="Description"
                        name="description"
                        required
                    />
                </div>
                <div className="add-product-category flex-col">
                    <p>Category</p>
                    <select name="category" onChange={changeHandler} value={data.category} required>
                        <option value="">Select a Category</option>
                        <option value="furniture">Furniture</option>
                        <option value="collectibles">Collectibles</option>
                        <option value="arts">Arts and Books</option>
                        <option value="oddities">Oddities</option>
                    </select>
                </div>
                <div className="add-product-price">
                    <div className="add-product-sellprice flex-col">
                        <p>Selling Price</p>
                        <input
                            value={data.price}
                            onChange={changeHandler}
                            type="number"
                            placeholder="Selling Price"
                            name="price"
                            required
                        />
                    </div>
                    
                </div>
                <div className="add-product-delivery flex-col">
                        <p>Delivery Price</p>
                        <input
                            value={data.deliveryPrice}
                            onChange={changeHandler}
                            type="number"
                            placeholder="Delivery Price"
                            name="deliveryPrice"
                            required
                        />
                    </div>

                <button type="submit">Add Product</button>
            </form>
        </div>
    );
};

export default AddProduct;
