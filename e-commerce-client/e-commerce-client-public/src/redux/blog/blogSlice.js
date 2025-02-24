import { getBlogs } from '@/redux/blog/blogAction';
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  blogs: [],
  total: null,
  isLoading: false,
  isSuccess: false,
  message: ''
};

export const blogsSlice = createSlice({
  name: 'blogs',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getBlogs.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getBlogs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = action.payload.success;
        state.blogs = action.payload.blogs;
        state.message = action.payload.message;
        state.total = action.payload.total;
      })
      .addCase(getBlogs.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = action.payload.success;
        state.message = action.payload.message;
        state.total = null;
      });
  }
});

export default blogsSlice.reducer;
