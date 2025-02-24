import { getCarts } from '@/redux/cart/cartAction';
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  carts: [],
  isLoading: false,
  isSuccess: false,
  message: ''
};

export const cartsSlice = createSlice({
  name: 'carts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCarts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCarts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = action.payload.success;
        state.carts = action.payload.cart;
        state.message = action.payload.message;
      })
      .addCase(getCarts.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = action.payload.success;
        state.message = action.payload.message;
      });
  }
});

export default cartsSlice.reducer;
