import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  token: ''
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
    }
  }
});

export const { isLoggedIn, isLoggedOut } = authSlice.actions;

export default authSlice.reducer;
