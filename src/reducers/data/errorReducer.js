import { SET_ERROR, RESET_ERROR } from 'actions/typeConstants';

const INITIAL_STATE = {
  message: '',
  data: ''
};

const errorReducer = (state = INITIAL_STATE, { type, payload }) => {
  switch (type) {
    case SET_ERROR:
      return {
        ...state,
        message: payload.message || payload.data?.message,
        data: payload
      };
    case RESET_ERROR:
      return INITIAL_STATE;
    default:
      return state;
  }
};

export default errorReducer;
