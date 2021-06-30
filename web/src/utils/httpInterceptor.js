import api from 'services/api';
import { useAuth } from '../hooks/auth';

const HttpInterceptor = () => {
  const { refreshToken } = useAuth();

  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error?.response?.config?.url === '/auth/refresh') {
        return Promise.reject(error);
      }

      if (error.response && error.response.status === 401) {
        return refreshToken().then((res) => {
          const { accessToken } = res || {};
          error.config.headers.Authorization = `Bearer ${accessToken}`;
          return api.request(error.config);
        });
      }

      return Promise.reject(error);
    }
  );

  return null;
};

export default HttpInterceptor;
