import { getOrders } from '@/api/config';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const getAllOrders = createAsyncThunk(
  'order/get-orders',
  async (params) => {
    const response = await getOrders(params);
    return response;
  }
);
