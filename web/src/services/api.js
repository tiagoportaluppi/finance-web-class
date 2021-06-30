import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL_API,
});

export const cleanApi = axios.create();

export default api;
