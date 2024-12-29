import axios from 'axios';
import { apiUrl } from './apiConfig';

const axiosInstance = axios.create();

axiosInstance.interceptors.request.use((config) => {
  config.url = `${apiUrl}${config.url}`;
  return config;
});

export default axiosInstance;
