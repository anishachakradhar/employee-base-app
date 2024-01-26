import { combineReducers } from 'redux';

import authReducer from 'reducers/ui/authReducer';

export default combineReducers({
  auth: authReducer
});
