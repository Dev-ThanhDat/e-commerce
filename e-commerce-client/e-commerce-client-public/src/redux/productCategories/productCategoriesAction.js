import { getAllPCategories } from '@/api/config';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const getPCategories = createAsyncThunk(
  'productCategory/get-categories',
  async (params) => {
    const response = await getAllPCategories(params);
    return response;
  }
);
