import { call, put, takeLatest } from 'redux-saga/effects';
import apiClient from '../../api/client';
import { authStorage } from '../../utils/storage';
import { authActions } from './authSlice';

function saveAuth(response) {
  authStorage.setToken(response.data.accessToken);
  authStorage.setUser(response.data.user);
}

function* loginWorker(action) {
  try {
    const response = yield call(apiClient.post, '/auth/login', action.payload);
    saveAuth(response);
    yield put(authActions.loginSuccess(response.data));
  } catch (error) {
    const message =
      error?.response?.data?.message ?? 'Unable to login. Please try again.';
    authStorage.clearAll();
    yield put(authActions.loginFailure(message));
  }
}

function* registerWorker(action) {
  try {
    const response = yield call(apiClient.post, '/auth/register', action.payload);
    saveAuth(response);
    yield put(authActions.loginSuccess(response.data));
  } catch (error) {
    const message =
      error?.response?.data?.message ?? 'Unable to register. Please try again.';
    authStorage.clearAll();
    yield put(authActions.registerFailure(message));
  }
}

function* logoutWorker() {
  authStorage.clearAll();
}

export function* authSaga() {
  yield takeLatest(authActions.loginRequest.type, loginWorker);
  yield takeLatest(authActions.registerRequest.type, registerWorker);
  yield takeLatest(authActions.logout.type, logoutWorker);
}
