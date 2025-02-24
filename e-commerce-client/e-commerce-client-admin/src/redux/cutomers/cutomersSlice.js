import { getUsers } from '@/redux/cutomers/cutomersAction';
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  customers: [],
  total: null,
  isLoading: false,
  isSuccess: false,
  message: ''
};

export const cutomersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUsers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = action.payload.success;
        state.customers = action.payload.users;
        state.message = action.payload.message;
        state.total = action.payload.total;
      })
      .addCase(getUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = action.payload.success;
        state.message = action.payload.message;
        state.total = null;
      });
  }
});

export default cutomersSlice.reducer;
