import { updateUser } from '@/redux/auth/authAction';
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  token: '',
  isSuccess: false,
  message: ''
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    isLoggedIn: (state, action) => {
      state.token = action.payload.accessToken;
      state.user = action.payload.user;
    },
    isLoggedOut: (state) => {
      state.token = '';
      state.user = null;
    },
    updataUser: (state, action) => {
      state.user = action.payload.user;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isSuccess = action.payload.success;
        state.user = action.payload.user;
        state.message = action.payload.message;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isSuccess = action.payload.success;
        state.message = action.payload.message;
      });
  }
});

export const { isLoggedIn, isLoggedOut, updataUser } = authSlice.actions;

export default authSlice.reducer;
