import { updateAUser } from '@/api/config';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const updateUser = createAsyncThunk('user/update', async (data) => {
  const response = await updateAUser(data);
  return response;
});
