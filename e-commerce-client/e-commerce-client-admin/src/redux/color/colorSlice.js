import { getColors } from '@/redux/color/colorAction';
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  colors: [],
  total: null,
  isLoading: false,
  isSuccess: false,
  message: ''
};

export const colorsSlice = createSlice({
  name: 'colors',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getColors.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getColors.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = action.payload.success;
        state.colors = action.payload.colors;
        state.message = action.payload.message;
        state.total = action.payload.total;
      })
      .addCase(getColors.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = action.payload.success;
        state.message = action.payload.message;
        state.total = null;
      });
  }
});

export default colorsSlice.reducer;
