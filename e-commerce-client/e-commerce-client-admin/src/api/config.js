import axios from './axios';

// Auth
export const login = (email, password) => {
  return axios.post('/api/auth/login', { email, password });
};
export const logout = () => {
  return axios.post('/api/auth/logout');
};
export const refreshToken = () => {
  return axios.post('/api/auth/refresh-token');
};
export const registerUser = (data) => {
  return axios.post('/api/auth/register', data);
};

// User
export const getAUser = (userId) => {
  return axios.get(`/api/user/${userId}`);
};
export const getAllUsers = (params) => {
  return axios.get(`/api/user/all-users`, {
    params
  });
};
export const deleteUsers = (userId) => {
  return axios.delete(`/api/user/${userId}`);
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
export const createProducts = (data) => {
  return axios.post(`/api/product`, data);
};
export const updateProducts = (productId, data) => {
  return axios.put(`/api/product/${productId}`, data);
};
export const deleteProducts = (productId) => {
  return axios.delete(`/api/product/${productId}`);
};

// Brand
export const getAllBrands = (params) => {
  return axios.get(`/api/brand`, {
    params
  });
};
export const createBrands = (title) => {
  return axios.post(`/api/brand`, { title });
};
export const updateBrands = (brandId, title) => {
  return axios.put(`/api/brand/${brandId}`, { title });
};
export const deleteBrands = (brandId) => {
  return axios.delete(`/api/brand/${brandId}`);
};

// Categories Product
export const getAllPCategories = (params) => {
  return axios.get(`/api/pcategory`, {
    params
  });
};
export const createPCategorys = (title) => {
  return axios.post(`/api/pcategory`, { title });
};
export const updatePCategorys = (categoryId, title) => {
  return axios.put(`/api/pcategory/${categoryId}`, { title });
};
export const deletePCategorys = (categoryId) => {
  return axios.delete(`/api/pcategory/${categoryId}`);
};

// Categories Blog
export const getAllBCategories = (params) => {
  return axios.get(`/api/bcategory`, {
    params
  });
};
export const createBCategorys = (title) => {
  return axios.post(`/api/bcategory`, { title });
};
export const updateBCategorys = (categoryId, title) => {
  return axios.put(`/api/bcategory/${categoryId}`, { title });
};
export const deleteBCategorys = (categoryId) => {
  return axios.delete(`/api/bcategory/${categoryId}`);
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
export const createBlogs = (data) => {
  return axios.post(`/api/blog`, data);
};
export const updateBlogs = (blodId, data) => {
  return axios.put(`/api/blog/${blodId}`, data);
};
export const deleteBlogs = (blodId) => {
  return axios.delete(`/api/blog/${blodId}`);
};

// Color
export const getAllColors = (params) => {
  return axios.get(`/api/color`, {
    params
  });
};
export const createColors = (title) => {
  return axios.post(`/api/color`, { title });
};
export const updateColors = (colorId, title) => {
  return axios.put(`/api/color/${colorId}`, { title });
};
export const deleteColors = (colorId) => {
  return axios.delete(`/api/color/${colorId}`);
};

// Order
export const getAllOrders = (params) => {
  return axios.get(`/api/order`, {
    params
  });
};
export const updateOrders = (orderId, status) => {
  return axios.put(`/api/order/${orderId}`, { status });
};
export const deleteOrders = (orderId) => {
  return axios.delete(`/api/order/${orderId}`);
};

// Coupon
export const getAllCoupons = (params) => {
  return axios.get(`/api/coupon`, {
    params
  });
};
export const createCoupons = (data) => {
  return axios.post(`/api/coupon`, data);
};
export const updateCoupons = (couponId, data) => {
  return axios.put(`/api/coupon/${couponId}`, data);
};
export const deleteCoupons = (couponId) => {
  return axios.delete(`/api/coupon/${couponId}`);
};
