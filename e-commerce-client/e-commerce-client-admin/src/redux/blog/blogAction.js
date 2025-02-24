import { getAllBlogs } from '@/api/config';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const getBlogs = createAsyncThunk('blog/get-blogs', async (params) => {
  const response = await getAllBlogs(params);
  return response;
});
