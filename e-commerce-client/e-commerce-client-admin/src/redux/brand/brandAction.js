import { getAllBrands } from '@/api/config';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const getBrands = createAsyncThunk(
  'brand/get-brands',
  async (params) => {
    const response = await getAllBrands(params);
    return response;
  }
);
