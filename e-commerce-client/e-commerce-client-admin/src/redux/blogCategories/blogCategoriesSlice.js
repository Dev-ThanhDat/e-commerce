import { getBCategories } from '@/redux/blogCategories/blogCategoriesAction';
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  bCategories: [],
  total: null,
  isLoading: false,
  isSuccess: false,
  message: ''
};

export const bCategorySlice = createSlice({
  name: 'bCategories',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getBCategories.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getBCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = action.payload.success;
        state.bCategories = action.payload.categories;
        state.message = action.payload.message;
        state.total = action.payload.total;
      })
      .addCase(getBCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = action.payload.success;
        state.message = action.payload.message;
        state.total = null;
      });
  }
});

export default bCategorySlice.reducer;
