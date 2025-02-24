import { getBrands } from '@/redux/brand/brandAction';
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  brands: [],
  total: null,
  isLoading: false,
  isSuccess: false,
  message: ''
};

export const brandsSlice = createSlice({
  name: 'brands',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getBrands.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getBrands.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = action.payload.success;
        state.brands = action.payload.brands;
        state.message = action.payload.message;
        state.total = action.payload.total;
      })
      .addCase(getBrands.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = action.payload.success;
        state.message = action.payload.message;
        state.total = null;
      });
  }
});

export default brandsSlice.reducer;
