import { getAllProducts } from '@/api/config';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const getProducts = createAsyncThunk(
  'product/get-products',
  async (params) => {
    const response = await getAllProducts(params);
    return response;
  }
);
