import { takeLatest, call, put } from 'redux-saga/effects';
import { FETCH_REQUESTED_WFH, FETCH_WFH, UPDATE_WFH_STATUS } from 'actions/typeConstants';
import { wfhList, fetchRequestedWfhs, updateWfhStatus } from 'services/wfhServices';
import { fetchRequestedWfhsSuccess, fetchWfhSucess, updateWfhStatusSuccess } from 'actions/wfhActions';
import { setError } from 'actions/errorActions';

const showWfhList = function* (payload) {
  const response = yield call(wfhList, payload);
  yield put(fetchWfhSucess(response));
};

const fetchRequestedWfh = function* (payload) {
  const response = yield call(fetchRequestedWfhs, payload);
  yield put(fetchRequestedWfhsSuccess(response));
};

const updateStatus = function* ({ payload }) {
  const { wfhId, approve } = payload;
  try {
    const response = yield call(updateWfhStatus, wfhId, approve);
    yield put(updateWfhStatusSuccess(response));
  } catch (error) {
    const { data } = error.response;
    yield put(setError(data));
  }
};

export default function* wfhWatcher() {
  yield takeLatest(FETCH_WFH, showWfhList);
  yield takeLatest(FETCH_REQUESTED_WFH.requested, fetchRequestedWfh);
  yield takeLatest(UPDATE_WFH_STATUS.requested, updateStatus);
}
