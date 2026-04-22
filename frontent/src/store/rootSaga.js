import { all, fork } from 'redux-saga/effects';
import { authSaga } from '../features/auth/authSaga';
import { logSaga } from '../features/logs/logSaga';
import { userSaga } from '../features/users/userSaga';

export function* rootSaga() {
  yield all([fork(authSaga), fork(logSaga), fork(userSaga)]);
}
