import { getWishlistOfUser } from '@/api/config';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const getWishlist = createAsyncThunk(
  'user/get-wishlist',
  async (userId) => {
    const response = await getWishlistOfUser(userId);
    return response;
  }
);
