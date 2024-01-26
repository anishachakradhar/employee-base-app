import { GET } from 'constants/appConstant';
import endpoints from 'constants/endpoints';
import http from 'utils/http';

export const getAttendances = async (params) => {
  const { data } = await http(GET, endpoints.attendance.list, { params });

  return data;
};
