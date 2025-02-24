import { getAllColors } from '@/api/config';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const getColors = createAsyncThunk(
  'color/get-colors',
  async (params) => {
    const response = await getAllColors(params);
    return response;
  }
);
