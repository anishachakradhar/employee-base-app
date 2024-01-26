import { LOGIN, RESET_USER, SET_USER } from 'actions/typeConstants';
import { mapToUserFromAcessToken } from 'utils/mapper';

const INITIAL_STATE = {
  user: null,
  isAuthenticated: false
};

const authReducer = (state = INITIAL_STATE, { type, payload }) => {
  switch (type) {
    case LOGIN.fulfilled:
    case SET_USER:
      return {
        user: payload,
        isAuthenticated: true
      };
    case LOGIN.rejected:
    case RESET_USER:
      return INITIAL_STATE;
    default:
      return state;
  }
};

export default authReducer;
