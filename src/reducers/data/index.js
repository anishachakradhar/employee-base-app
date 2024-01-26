import { combineReducers } from 'redux';

import wfhReducer from 'reducers/data/wfhReducer';
import authReducer from 'reducers/data/authReducer';
import errorReducer from 'reducers/data/errorReducer';

export default combineReducers({
  auth: authReducer,
  wfh: wfhReducer,
  error: errorReducer
});
