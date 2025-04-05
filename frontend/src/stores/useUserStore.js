import { create } from 'zustand';
import axios from '../lib/axios';
import toast from 'react-hot-toast';

export const userUserStore = create((set, get) => ({
    user: null,
    loading: false,
    checkingAuth: false,

    signup: async (name, email, password) => {
        set({ loading: true });

        try {
            const res = await axios.post('/auth/signup', { name, email, password });
            set({ loading: false });

            if (res.data.success) {
                toast.success(res.data.message || 'User created successfully!');
                set({ user: res.data.user }); // Assuming the user object is part of the response
            } else {
                toast.error(res.data.message || 'An error occurred during signup');
            }
        } catch (error) {
            set({ loading: false });

            // Handle errors more robustly
            if (error.response) {
                // Server responded with a status outside of 2xx
                toast.error(error.response.data.message || 'Please check your email and password');
            } else if (error.request) {
                // No response was received
                toast.error('No response from server. Please try again later.');
            } else {
                // Something else went wrong
                toast.error(error.message || 'An error occurred during signup');
            }
        }
    },

    login: async (email, password) => {
        set({ loading: true });

        try {
            const res = await axios.post('/auth/login', { email, password });
            set({ user: res.data, loading: false });

            if (res.data.success) {
                toast.success(res.data.message || 'Login successful!');
                set({ user: res.data.user }); // Assuming the user object is part of the response
            } else {
                toast.error(res.data.message || 'Invalid credentials');
            }
        } catch (error) {
            set({ loading: false });

            // Handle errors more robustly
            if (error.response) {
                // Server responded with a status outside of 2xx
                toast.error(error.response.data.message || 'Invalid email or password');
            } else if (error.request) {
                // No response was received
                toast.error('No response from server. Please try again later.');
            } else {
                // Something else went wrong
                toast.error(error.message || 'An error occurred during login');
            }
        }
    },

    checkAuth: async () => {
        set({ checkingAuth: true });
        try {
            const response = await axios.get('/auth/profile');
            set({ user: response.data.user, checkingAuth: false });
        } catch (error) {
            set({ checkingAuth: false });
            if (error.response && error.response.status === 401) {
                // User is not authenticated
                set({ user: null });
            }
            
        }
    },

    logout : async () => {
        try {
            await axios.post('/auth/logout');
            set({ user: null });

        } catch (error) {
            toast.error(error.message || 'An error occurred during logout');
        }

    }


}));
