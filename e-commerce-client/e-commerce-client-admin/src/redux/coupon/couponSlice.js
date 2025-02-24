import { getCoupons } from '@/redux/coupon/couponAction';
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  coupons: [],
  total: null,
  isLoading: false,
  isSuccess: false,
  message: ''
};

export const couponsSlice = createSlice({
  name: 'coupons',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCoupons.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCoupons.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = action.payload.success;
        state.coupons = action.payload.coupons;
        state.message = action.payload.message;
        state.total = action.payload.total;
      })
      .addCase(getCoupons.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = action.payload.success;
        state.message = action.payload.message;
        state.total = null;
      });
  }
});

export default couponsSlice.reducer;
