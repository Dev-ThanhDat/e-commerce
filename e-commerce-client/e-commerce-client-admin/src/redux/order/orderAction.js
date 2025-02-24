import { getAllOrders } from '@/api/config';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const getOrders = createAsyncThunk(
  'order/get-orders',
  async (params) => {
    const response = await getAllOrders(params);
    return response;
  }
);
