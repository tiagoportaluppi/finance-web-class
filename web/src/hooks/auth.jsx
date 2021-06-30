import React, { createContext, useCallback, useState, useContext } from 'react';
import { message } from 'antd';

import { useFetch } from 'services/hooks';
import api from 'services/api';

const ACCESS_TOKEN = 'access_token';
const REFRESH_TOKEN = 'refresh_token';

const AuthContext = createContext({});

const AuthProvider = ({ children }) => {
  const [credentials, setCredentials] = useState(() => {
    const accessToken = localStorage.getItem(ACCESS_TOKEN);
    const refreshToken = localStorage.getItem(REFRESH_TOKEN);

    if (accessToken) {
      api.defaults.headers.Authorization = `Bearer ${accessToken}`;
    }

    return { accessToken, refreshToken };
  });
  const [user, setUser] = useState();

  const { post: postSignIn, error: errorSignIn, loading } = useFetch();
  const { get: getUser } = useFetch();

  const signIn = useCallback(
    async ({ email, password }) => {
      try {
        const response = await postSignIn({
          url: '/auth/signin',
          payload: {
            email,
            password,
          },
        });

        const { accessToken, refreshToken } = response;

        localStorage.setItem(ACCESS_TOKEN, accessToken);
        localStorage.setItem(REFRESH_TOKEN, refreshToken);

        api.defaults.headers.Authorization = `Bearer ${accessToken}`;

        setCredentials({ accessToken, refreshToken });
      } catch (error) {
        // TODO
      }
    },
    [postSignIn]
  );

  const refreshToken = useCallback(async () => {
    const token = localStorage.getItem(REFRESH_TOKEN);

    return api.post('/auth/refresh', { token }).then((res) => {
      const { accessToken } = res.data || {};

      localStorage.setItem(ACCESS_TOKEN, accessToken);

      api.defaults.headers.Authorization = `Bearer ${accessToken}`;

      setCredentials((currentCredentials) => ({
        ...currentCredentials,
        accessToken,
      }));

      return res.data;
    });
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(REFRESH_TOKEN);

    setCredentials({});
  }, []);

  const isAuthenticated = useCallback(() => {
    return !!localStorage.getItem(ACCESS_TOKEN);
  }, []);

  const getLoggedUser = useCallback(async () => {
    try {
      const response = await getUser({ url: '/users/me' });
      setUser(response);
    } catch (err) {
      message.error('Sessão expirada. Faça login novamente');
      signOut();
    }
  }, [getUser, signOut]);

  return (
    <AuthContext.Provider
      value={{
        credentials,
        user,
        signIn,
        signOut,
        refreshToken,
        isAuthenticated,
        getLoggedUser,
        loading,
        errorSignIn,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}

export { AuthProvider, useAuth };
