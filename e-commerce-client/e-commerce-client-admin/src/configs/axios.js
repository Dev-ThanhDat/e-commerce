import axios from 'axios';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_ENDPOINT,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json'
  },
  withCredentials: true
});

instance.interceptors.request.use(
  function (config) {
    const persistedData = localStorage.getItem('persist:ecommerceadmin');
    if (persistedData) {
      const authData = JSON.parse(JSON.parse(persistedData)?.auth);
      const token = authData?.token;
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }
    if (config.data instanceof FormData) {
      config.headers['Content-Type'] = 'multipart/form-data';
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  function (response) {
    return response && response.data ? response.data : response;
  },
  async function (error) {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_ENDPOINT}/api/auth/refresh-token`,
          {},
          { withCredentials: true }
        );
        const newToken = response.data.accessToken;
        localStorage.setItem(
          'persist:ecommerceadmin',
          JSON.stringify({
            ...JSON.parse(localStorage.getItem('persist:ecommerceadmin')),
            auth: JSON.stringify({ token: newToken })
          })
        );
        axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
        return axios(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('persist:ecommerceadmin');
        window.location.href = '/dang-nhap';
        return Promise.reject(refreshError);
      }
    }
    return error?.response?.data ?? Promise.reject(error);
  }
);

export default instance;
