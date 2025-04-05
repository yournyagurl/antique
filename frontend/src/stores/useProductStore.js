import { create } from 'zustand';
import toast from 'react-hot-toast';
import axios from '../lib/axios';

export const useProductStore = create((set) => ({
    products: [],
    setProducts: (products) => set({ products }),
    loading: false,

    createProduct: async (productData) => {
        set({ loading: true });
        try {
            const res = await axios.post('/products/createproduct', productData);
            set((prevState) => ({
                products: [...prevState.products, res.data],
                loading: false
            }));
            toast.success(res.data.message || 'Product created successfully!');
        } catch (error) {

            set({ loading: false });
            toast.error(error.response.data.message || 'An error occurred during product creation');
            
        }
    },


    fetchAllProducts: async () => {
        set({ loading: true });
        try {
            const res = await axios.get('/products/getallproducts');
            set({ products: res.data, loading: false }); 
        } catch (error) {
            set ({ loading: false });
            toast.error(error.response.data.message || 'An error occurred while fetching products');
        }
    },

    deleteProduct: async (productId) => {
		set({ loading: true });
		try {
			await axios.delete(`/products/${productId}`);
			set((prevProducts) => ({
				products: prevProducts.products.filter((product) => product._id !== productId),
				loading: false,
			}));
		} catch (error) {
			set({ loading: false });
			toast.error(error.response.data.error || "Failed to delete product");
		}
	},


    newCollection: async () => {
        set({ loading: true });
        try {
            const res = await axios.get('/products/newcollection');
            console.log(res.data);
            set({ products: res.data, loading: false }); 
        } catch (error) {
            set ({ loading: false });
            toast.error(error.response.data.message || 'An error occurred while fetching products');
        }
    },
}))