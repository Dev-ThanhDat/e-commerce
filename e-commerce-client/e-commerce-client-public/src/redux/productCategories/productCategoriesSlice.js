import { getPCategories } from '@/redux/productCategories/productCategoriesAction';
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  pCategories: [],
  isLoading: false,
  isSuccess: false,
  message: ''
};

export const pCategorySlice = createSlice({
  name: 'pCategories',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getPCategories.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getPCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = action.payload.success;
        state.pCategories = action.payload.categories;
        state.message = action.payload.message;
      })
      .addCase(getPCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = action.payload.success;
        state.message = action.payload.message;
      });
  }
});

export default pCategorySlice.reducer;
