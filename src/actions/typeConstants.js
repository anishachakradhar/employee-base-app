import { createApiPromiseActions } from 'utils/apiPromiseActions';

export const SET_ERROR = 'SET_ERROR';
export const RESET_ERROR = 'RESET_ERROR';

export const SET_USER = 'SET_USER';
export const RESET_USER = 'RESET_USER';

export const LOGIN = createApiPromiseActions('LOGIN');
export const REFRESH_TOKEN = createApiPromiseActions('REFRESH_TOKEN');

export const FETCH_WFH = 'FETCH_WFH';
export const FETCH_WFH_SUCCESS = 'FETCH_WFH_SUCCESS';

export const SEND_WFH_REPORT = 'SEND_WFH_REPORT';

export const FETCH_REQUESTED_WFH = createApiPromiseActions('FETCH_REQUESTED_WFH');
export const UPDATE_WFH_STATUS = createApiPromiseActions('UPDATE_WFH_STATUS');

export const FETCH_WFO = 'FETCH_WFO';
export const FETCH_WFO_SUCCESS = 'FETCH_WFO_SUCCESS';

export const SEND_WFO_REPORT = 'SEND_WFO_REPORT';

export const FETCH_REQUESTED_WFO = createApiPromiseActions('FETCH_REQUESTED_WFO');
export const UPDATE_WFO_STATUS = createApiPromiseActions('UPDATE_WFO_STATUS');
