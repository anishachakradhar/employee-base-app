import axios from 'axios';
import config from '../config';
import { getState } from 'store/store';
import { CSRF_TOKEN } from 'constants/routes';

const BASIC_CONFIG = {
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  },
  withCredentials: true
};

const instance = axios.create({
  ...BASIC_CONFIG,
  baseURL: config.apiUrl
});

const onPostCall = (config) => config.method === 'post';

instance.interceptors.request.use(
  async (axiosConfig) => {
    await axios.get(CSRF_TOKEN, { ...BASIC_CONFIG, baseURL: config.serverUrl });

    return axiosConfig;
  },
  (error) => Promise.reject(error),
  { synchronous: true, runWhen: onPostCall }
);

const http = (method, url, { params = {}, body = {}, headers = {}, others = {} } = {}) => {
  return instance({
    url,
    method,
    data: body,
    params,
    headers,
    ...others
  });
};

export default http;
