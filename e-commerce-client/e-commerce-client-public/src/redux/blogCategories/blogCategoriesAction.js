import { getAllBCategories } from '@/api/config';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const getBCategories = createAsyncThunk(
  'blogCategory/get-categories',
  async (params) => {
    const response = await getAllBCategories(params);
    return response;
  }
);
