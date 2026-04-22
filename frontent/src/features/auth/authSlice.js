import { createSlice } from '@reduxjs/toolkit';
import { authStorage } from '../../utils/storage';

const initialState = {
  user: authStorage.getUser(),
  token: authStorage.getToken(),
  isAuthenticated: Boolean(authStorage.getToken()),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginRequest(state) {
      state.loading = true;
      state.error = null;
    },
    registerRequest(state) {
      state.loading = true;
      state.error = null;
    },
    loginSuccess(state, action) {
      state.loading = false;
      state.token = action.payload.accessToken;
      state.user = action.payload.user;
      state.isAuthenticated = true;
    },
    loginFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
    },
    registerFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    clearAuthError(state) {
      state.error = null;
    },
  },
});

export const authReducer = authSlice.reducer;
export const authActions = authSlice.actions;
