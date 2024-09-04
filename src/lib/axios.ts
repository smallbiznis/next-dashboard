import axios, { AxiosHeaders } from 'axios';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { SessionData, sessionOption } from './session';
import { refreshToken } from './oauth2';

const auth = axios.create({
  baseURL: process.env.OAUTH_URI,
  validateStatus: (status: number) => {
    return status >= 200 && status < 500;
  },
});

const api = axios.create({
  baseURL: process.env.RESOURCE_API_URI,
  validateStatus: (status: number) => {
    return status >= 200 && status < 500;
  },
});

api.interceptors.request.use(
  async (config) => {
    const sess = await getIronSession<SessionData>(cookies(), sessionOption);
    if (sess.tokenInfo) {
      config.headers.Accept = 'application/json';
      config.headers.Authorization = `Bearer ${sess.tokenInfo?.access_token}`;
    }
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async function (error) {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      const sess = await getIronSession<SessionData>(cookies(), sessionOption);
      if (sess.tokenInfo) {
        originalRequest._retry = true;
        const access_token = await refreshToken(sess.tokenInfo.access_token);
        axios.defaults.headers.common['Authorization'] =
          'Bearer ' + access_token;
      }
      return api(originalRequest);
    }
    return Promise.reject(error);
  }
);

export { api, auth };
