import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from './auth/authSlice';
import productReducer from './product/productSlice';
import userReducer from './user/userSlice';
import blogReducer from './blog/blogSlice';
import cartsSlice from './cart/cartSlice';
import orderReducer from './order/orderSlice';
import pCategoryReducer from './productCategories/productCategoriesSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  product: productReducer,
  blog: blogReducer,
  cart: cartsSlice,
  order: orderReducer,
  pCategory: pCategoryReducer
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
