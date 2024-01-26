import { createActions } from 'utils/createActions';
import { SET_ERROR, RESET_ERROR } from './typeConstants';

export const setError = (payload) => createActions(SET_ERROR, payload);
export const resetError = (payload) => createActions(RESET_ERROR, payload);
