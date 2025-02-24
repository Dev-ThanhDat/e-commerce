import axios from './axios';

// Auth
export const login = (email, password) => {
  return axios.post('/api/auth/login', { email, password });
};
export const registerUser = (data) => {
  return axios.post('/api/auth/register', data);
};
export const logout = () => {
  return axios.post('/api/auth/logout');
};
export const refreshToken = () => {
  return axios.post('/api/auth/refresh-token');
};
export const restPassword = (oldPassword, newPassword) => {
  return axios.put('/api/auth/reset-password', { oldPassword, newPassword });
};

// User
export const getWishlistOfUser = (userId) => {
  return axios.get(`/api/user/wishlist/${userId}`);
};
export const addToWishlist = (productId) => {
  return axios.post(`/api/user/wishlist/${productId}`);
};
export const getAUser = (userId) => {
  return axios.get(`/api/user/${userId}`);
};
export const updateAUser = (data) => {
  return axios.put(`/api/user/update`, data);
};

// Product
export const getAllProducts = (params) => {
  return axios.get(`/api/product`, {
    params
  });
};
export const getAProducts = (productId) => {
  return axios.get(`/api/product/${productId}`);
};
export const ratingProduct = (productId, star, comment) => {
  return axios.put(`/api/product/rating`, { productId, star, comment });
};

// Blog
export const getAllBlogs = (params) => {
  return axios.get(`/api/blog`, {
    params
  });
};
export const getABlogs = (blodId) => {
  return axios.get(`/api/blog/${blodId}`);
};

// Cart
export const getAllCarts = (userId) => {
  return axios.get(`/api/cart/${userId}`);
};
export const createCarts = (data) => {
  return axios.post(`/api/cart/add`, data);
};
export const updateCarts = (productId, quantity) => {
  return axios.put(`/api/cart/update`, { productId, quantity });
};
export const deleteProductCarts = (productId) => {
  return axios.post(`/api/cart/remove-product`, { productId });
};

// Coupon
export const applyCoupon = (coupon) => {
  return axios.post(`/api/coupon/apply`, { coupon });
};

// Order
export const createOrders = (data) => {
  return axios.post(`/api/order/cash`, data);
};
export const getOrders = (params) => {
  return axios.get(`/api/order/order`, {
    params
  });
};

// Product Categories
export const getAllPCategories = (params) => {
  return axios.get(`/api/pcategory`, {
    params
  });
};

// Product Categories
export const getAllBCategories = (params) => {
  return axios.get(`/api/bcategory`, {
    params
  });
};
