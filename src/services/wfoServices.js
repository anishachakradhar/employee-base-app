import http from 'utils/http';
import endpoints from 'constants/endpoints';
import { GET, POST } from 'constants/appConstant';
import { interpolate } from 'utils/string';
import { format } from 'utils/datetime';

export const wfoApply = async (payload) => {
  const { data } = await http('POST', endpoints.wfo.apply, {
    body: payload
  });
  return data;
};

export const formatApplyWfoInput = (input) => {
  return {
    attendanceDate: format(input.attendanceDate),
    reason: input.reason,
    todo: input.todo,
    blockers: input.blockers
  };
};

export const getWfos = async (params) => {
  const { data } = await http('GET', endpoints.wfo.list, { params });

  return data;
};

export const fetchRequestedWfos = async (params) => {
  const { data } = await http('GET', endpoints.wfo.requestedWfo, { params });

  return data;
};

export const updateWfoStatus = async (wfoId, status) => {
  const { data } = await http('PUT', `/wfos/${wfoId}`, {
    body: {
      status
    }
  });

  return data;
};

export const sendWfoReport = async (wfoId, formData) => {
  const { data } = await http('PUT', interpolate(endpoints.wfo.update, wfoId), {
    body: {
      done: formData.done,
      workForwarded: formData.workForwarded
    }
  });

  return data;
};

export const fetchWfoById = async (wfoId) => {
  const { data } = await http(GET, interpolate(endpoints.wfo.show, wfoId));

  return data;
};
