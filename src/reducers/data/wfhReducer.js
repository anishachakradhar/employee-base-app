import { FETCH_WFH_SUCCESS, SEND_WFH_REPORT, FETCH_REQUESTED_WFH, UPDATE_WFH_STATUS } from 'actions/typeConstants';

const INITIALSTATE = {
  wfhList: [],
  requestedWfhs: [],
  sendReportData: {}
};

const wfhReducer = (state = INITIALSTATE, { type, payload }) => {
  switch (type) {
    case FETCH_WFH_SUCCESS:
      return {
        ...state,
        wfhList: payload
      };

    case FETCH_REQUESTED_WFH.fulfilled:
      return { ...state, requestedWfhs: payload };

    case SEND_WFH_REPORT:
      return {
        ...state,
        sendReportData: state.wfhList.data.find((wfh) => {
          if (wfh.id === payload) {
            return wfh;
          }

          return null;
        })
      };

    case UPDATE_WFH_STATUS.fulfilled:
      const toBeUpdatedIndex = state.requestedWfhs.data.findIndex((wfh) => wfh.id === payload.id);
      const updatedWfh = [...state.requestedWfhs.data];
      updatedWfh[toBeUpdatedIndex] = payload;
      return {
        ...state,
        requestedWfhs: { ...state.requestedWfhs, data: updatedWfh }
      };
    default:
      return state;
  }
};

export default wfhReducer;
