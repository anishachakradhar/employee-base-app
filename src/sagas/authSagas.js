import { takeLatest, put, call } from 'redux-saga/effects';

import { login, refresh } from 'services/authServices';
import { LOGIN, REFRESH_TOKEN } from 'actions/typeConstants';
import {
  loginSuccess,
  loginRejected,
  resetUser,
  setUser,
  refreshTokenRejected,
  refreshTokenFulfilled
} from 'actions/authActions';
import { setError, resetError } from 'actions/errorActions';

const doLogin = function* ({ payload }) {
  try {
    yield put(resetError());

    const response = yield call(login, payload);

    yield put(loginSuccess(response));
  } catch (error) {
    const { data } = error.response;

    yield put(loginRejected());
    yield put(setError(data));
  }
};

const doRefreshToken = function* ({ payload }) {
  try {
    yield put(resetError());

    const response = yield call(refresh, payload);

    yield put(refreshTokenFulfilled(response));
    yield put(setUser(response));
  } catch (error) {
    yield put(refreshTokenRejected());
    yield put(resetUser());
  }
};

export default function* loginWatcher() {
  yield takeLatest(LOGIN.requested, doLogin);
  yield takeLatest(REFRESH_TOKEN.requested, doRefreshToken);
}
