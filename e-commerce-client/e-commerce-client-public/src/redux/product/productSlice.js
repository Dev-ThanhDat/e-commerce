import { getProducts } from '@/redux/product/productAction';
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  products: [],
  total: null,
  isLoading: false,
  isSuccess: false,
  message: ''
};

export const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = action.payload.success;
        state.products = action.payload.products;
        state.message = action.payload.message;
        state.total = action.payload.total;
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = action.payload.success;
        state.message = action.payload.message;
        state.null = action.payload.null;
      });
  }
});

export default productsSlice.reducer;
