import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from './auth/authSlice';
import blogReducer from './blog/blogSlice';
import bCategoryReducer from './blogCategories/blogCategoriesSlice';
import cartsSlice from './cart/cartSlice';
import orderReducer from './order/orderSlice';
import productReducer from './product/productSlice';
import pCategoryReducer from './productCategories/productCategoriesSlice';
import userReducer from './user/userSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  product: productReducer,
  blog: blogReducer,
  cart: cartsSlice,
  order: orderReducer,
  pCategory: pCategoryReducer,
  bCategory: bCategoryReducer
});

const persistConfig = {
  key: 'ecommerce',
  storage,
  whitelist: ['auth']
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
});

export const persistor = persistStore(store);
