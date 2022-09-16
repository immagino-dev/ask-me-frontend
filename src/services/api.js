import axios from 'axios';
import store from '~/store';

const url = import.meta.env.VITE_APP_URL;

const axiosInstance = axios.create({
  baseURL: url,
  validateStatus: function (status) {
    return status >= 200 && status <= 500
  }
});

axiosInstance.interceptors.request.use(
  function (config) {
    const token = store.getters.getToken;
    if (token) {
      config.headers.Authorization = 'Bearer ' + token;
    }
    return config;
  },
  function (error) {
    window.localStorage.clear();
    return Promise.reject(error);
  },
);

export default axiosInstance;