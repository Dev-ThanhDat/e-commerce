import { getAllCarts } from '@/api/config';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const getCarts = createAsyncThunk('cart/get-carts', async (userId) => {
  const response = await getAllCarts(userId);
  return response;
});
