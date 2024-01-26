import http from 'utils/http';
import endpoints from 'constants/endpoints';
import { GET, POST } from 'constants/appConstant';
import { interpolate } from 'utils/string';

export const wfhApply = async (payload) => {
  const { data } = await http('POST', endpoints.wfh.apply, {
    body: payload
  });
  return data;
};

export const formatApplyWfhInput = (input) => {
  return {
    attendanceDate: new Date(input.attendanceDate).toLocaleDateString(),
    reason: input.reason,
    todo: input.todo,
    blockers: input.blockers
  };
};

export const wfhList = async (params) => {
  const { data } = await http('GET', endpoints.wfh.list, { params: params.payload });

  return data;
};

export const fetchRequestedWfhs = async (params) => {
  const { data } = await http('GET', endpoints.wfh.requestedWfh, { params: params.payload });

  return data;
};

export const updateWfhStatus = async (wfhId, approve) => {
  const { data } = await http('PUT', `/wfh/${wfhId}/update`, {
    body: {
      approve
    }
  });

  return data;
};

export const sendWfhReport = async (wfhId, formData) => {
  const { data } = await http('PUT', `/wfh/${wfhId}/send-report`, {
    body: {
      done: formData.done,
      workForwarded: formData.workForwarded
    }
  });

  return data;
};

export const fetchWfhById = async (wfhId) => {
  const { data } = await http(GET, interpolate(endpoints.wfh.show, wfhId));

  return data;
};
