import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from './auth/authSlice';
import blogReducer from './blog/blogSlice';
import bCategoryReducer from './blogCategories/blogCategoriesSlice';
import brandReducer from './brand/brandSlice';
import colorReducer from './color/colorSlice';
import customerReducer from './cutomers/cutomersSlice';
import orderReducer from './order/orderSlice';
import couponReducer from './coupon/couponSlice';
import productReducer from './product/productSlice';
import pCategoryReducer from './productCategories/productCategoriesSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  customer: customerReducer,
  product: productReducer,
  blog: blogReducer,
  brand: brandReducer,
  pCategory: pCategoryReducer,
  bCategory: bCategoryReducer,
  coupon: couponReducer,
  color: colorReducer,
  order: orderReducer
});

const persistConfig = {
  key: 'ecommerceadmin',
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
