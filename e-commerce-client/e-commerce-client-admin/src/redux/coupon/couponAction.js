import { getAllCoupons } from '@/api/config';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const getCoupons = createAsyncThunk(
  'coupon/get-coupons',
  async (params) => {
    const response = await getAllCoupons(params);
    return response;
  }
);
