import { call, put, takeLatest } from 'redux-saga/effects';
import apiClient from '../../api/client';
import { userActions } from './userSlice';

function* fetchUsersWorker() {
  try {
    const response = yield call(apiClient.get, '/users');
    yield put(userActions.fetchUsersSuccess(response.data));
  } catch (error) {
    const message = error?.response?.data?.message ?? 'Unable to load users.';
    yield put(userActions.fetchUsersFailure(message));
  }
}

export function* userSaga() {
  yield takeLatest(userActions.fetchUsersRequest.type, fetchUsersWorker);
}
