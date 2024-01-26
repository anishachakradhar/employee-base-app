import { createActions } from 'utils/createActions';
import { LOGIN, REFRESH_TOKEN, RESET_USER, SET_USER } from './typeConstants';

export const loginRejected = (payload) => createActions(LOGIN.rejected, payload);
export const loginRequest = (payload) => createActions(LOGIN.requested, payload);
export const loginSuccess = (payload) => createActions(LOGIN.fulfilled, payload);

export const refreshTokenFulfilled = (payload) => createActions(REFRESH_TOKEN.fulfilled, payload);
export const refreshTokenRejected = (payload) => createActions(REFRESH_TOKEN.rejected, payload);
export const refreshTokenRequest = (payload) => createActions(REFRESH_TOKEN.requested, payload);

export const setUser = (payload) => createActions(SET_USER, payload);
export const resetUser = (payload) => createActions(RESET_USER, payload);
