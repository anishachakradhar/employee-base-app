import { FETCH_WFH, FETCH_WFH_SUCCESS, SEND_WFH_REPORT, FETCH_REQUESTED_WFH, UPDATE_WFH_STATUS } from './typeConstants';
import { createActions } from 'utils/createActions';

export const fetchWfh = (payload) => createActions(FETCH_WFH, payload);
export const fetchWfhSucess = (payload) => createActions(FETCH_WFH_SUCCESS, payload);
export const sendWfhReport = (id) => createActions(SEND_WFH_REPORT, id);
export const fetchRequestedWfhs = (payload) => createActions(FETCH_REQUESTED_WFH.requested, payload);
export const fetchRequestedWfhsSuccess = (payload) => createActions(FETCH_REQUESTED_WFH.fulfilled, payload);

export const updateWfhStatus = (payload) => createActions(UPDATE_WFH_STATUS.requested, payload);
export const updateWfhStatusSuccess = (payload) => createActions(UPDATE_WFH_STATUS.fulfilled, payload);
