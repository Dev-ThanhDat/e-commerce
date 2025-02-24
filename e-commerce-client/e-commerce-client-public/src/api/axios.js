import { logout, refreshToken } from '@/api/config';
import axios from 'axios';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_ENDPOINT,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
});

instance.interceptors.request.use(
  function (config) {
    const persistedData = localStorage.getItem('persist:ecommerce');
    if (persistedData) {
      const authData = JSON.parse(JSON.parse(persistedData)?.auth);
      const token = authData?.token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

let refreshTokenPromise = null;

instance.interceptors.response.use(
  function (response) {
    return response && response.data ? response.data : response;
  },
  async function (error) {
    if (error.response?.status === 401) {
      logout().then(() => {
        localStorage.removeItem('persist:ecommerce');
        location.href = '/dang-nhap';
      });
    }
    const originalRequest = error.config;
    if (error.response?.status === 410 && originalRequest) {
      if (!refreshTokenPromise) {
        refreshTokenPromise = refreshToken()
          .then((res) => {
            const newToken = res.accessToken;
            const persistedData = JSON.parse(
              localStorage.getItem('persist:ecommerce')
            );
            const authData = JSON.parse(persistedData.auth);
            authData.token = newToken;
            const ecommerceData = JSON.stringify({
              ...persistedData,
              auth: JSON.stringify(authData)
            });
            localStorage.setItem('persist:ecommerce', ecommerceData);
            instance.defaults.headers.Authorization = `Bearer ${newToken}`;
          })
          .catch(async (err) => {
            logout().then(() => {
              localStorage.removeItem('persist:ecommerce');
              location.href = '/dang-nhap';
            });
            return Promise.reject(err);
          })
          .finally(() => {
            refreshTokenPromise = null;
          });
      }
      return refreshTokenPromise.then(() => {
        return instance(originalRequest);
      });
    }
    return error?.response?.data ?? Promise.reject(error);
  }
);

export default instance;
