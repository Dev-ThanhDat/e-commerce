import { getWishlist } from '@/redux/user/userAction';
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  wishlist: [],
  isLoading: false,
  isSuccess: false,
  message: ''
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getWishlist.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getWishlist.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = action.payload.success;
        state.wishlist = action.payload.wishlist.wishlist;
        state.message = action.payload.message;
      })
      .addCase(getWishlist.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = action.payload.success;
        state.message = action.payload.message;
      });
  }
});

export default userSlice.reducer;
