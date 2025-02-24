import { getAllUsers } from '@/api/config';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const getUsers = createAsyncThunk(
  'customer/get-customers',
  async (params) => {
    const response = await getAllUsers(params);
    return response;
  }
);
