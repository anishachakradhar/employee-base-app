import { FETCH_WFO, FETCH_WFO_SUCCESS, SEND_WFO_REPORT, FETCH_REQUESTED_WFO, UPDATE_WFO_STATUS } from './typeConstants';
import { createActions } from 'utils/createActions';

export const fetchWfo = () => createActions(FETCH_WFO);
export const fetchWfoSucess = (payload) => createActions(FETCH_WFO_SUCCESS, payload);
export const sendWfoReport = (id) => createActions(SEND_WFO_REPORT, id);
export const fetchRequestedWfos = () => createActions(FETCH_REQUESTED_WFO.requested);
export const fetchRequestedWfosSuccess = (payload) => createActions(FETCH_REQUESTED_WFO.fulfilled, payload);

export const updateWfoStatus = (payload) => createActions(UPDATE_WFO_STATUS.requested, payload);
export const updateWfoStatusSuccess = (payload) => createActions(UPDATE_WFO_STATUS.fulfilled, payload);
