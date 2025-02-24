import { getAllOrders } from '@/redux/order/orderAction';
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  orders: [],
  total: null,
  isLoading: false,
  isSuccess: false,
  message: ''
};

export const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllOrders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = action.payload.success;
        state.orders = action.payload.orders;
        state.message = action.payload.message;
        state.total = action.payload.total;
      })
      .addCase(getAllOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = action.payload.success;
        state.message = action.payload.message;
        state.total = null;
      });
  }
});

export default ordersSlice.reducer;
