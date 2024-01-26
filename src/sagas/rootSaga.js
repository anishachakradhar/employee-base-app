import { all } from 'redux-saga/effects';

import loginWatcher from 'sagas/authSagas';
import wfhWatcher from './wfhSagas';

export default function* rootSaga() {
  yield all([loginWatcher(), wfhWatcher()]);
}
