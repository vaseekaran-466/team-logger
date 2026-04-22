import { combineReducers } from '@reduxjs/toolkit';
import { authReducer } from '../features/auth/authSlice';
import { logsReducer } from '../features/logs/logSlice';
import { usersReducer } from '../features/users/userSlice';

export const rootReducer = combineReducers({
  auth: authReducer,
  logs: logsReducer,
  users: usersReducer,
});
