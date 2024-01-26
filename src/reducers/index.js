import { combineReducers } from 'redux';

import ui from './ui';
import data from './data';

/**
 * Combine Reducer
 */
export default combineReducers({
  ui,
  data
});
