import http from 'utils/http';
import endpoints from 'constants/endpoints';

export const login = async ({ email, password }) => {
  const { data } = await http('POST', endpoints.login, {
    body: { email, password }
  });

  return data;
};

export const refresh = async () => {
  const { data } = await http('POST', endpoints.refresh, {
    others: {
      withCredentials: true
    }
  });

  return data;
};

export const getUser = async () => {
  const { data } = await http('GET', endpoints.user);

  return data;
};
