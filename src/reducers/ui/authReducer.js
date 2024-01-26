import { LOGIN, REFRESH_TOKEN } from 'actions/typeConstants';

const INITIAL_STATE = {
  isLoading: false
};

const authReducer = (state = INITIAL_STATE, { type, payload }) => {
  switch (type) {
    case REFRESH_TOKEN.request:
    case REFRESH_TOKEN.pending:
    case LOGIN.requested:
    case REFRESH_TOKEN.requested:
      return {
        ...state,
        isLoading: true
      };

    case REFRESH_TOKEN.fulfilled:
    case REFRESH_TOKEN.rejected:
    case LOGIN.fulfilled:
    case LOGIN.rejected:
      return {
        ...state,
        isLoading: false
      };
    default:
      return state;
  }
};

export default authReducer;
