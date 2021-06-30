import { useState, useCallback } from 'react';

import api from 'services/api';

import { message } from 'antd';

const useFetch = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(undefined);
  const [error, setError] = useState(undefined);

  const clearData = useCallback(() => {
    setData(undefined);
  }, []);

  const get = useCallback(
    async ({
      url,
      config,
      clearData: clearDataParam,
      showError = true,
      showMessage = true,
    }) => {
      try {
        if (clearDataParam) clearData();
        setError(undefined);
        setLoading(true);

        const response = await api.get(url, config);
        setData(response?.data);

        return Promise.resolve(response?.data);
      } catch (err) {
        setError(err?.response?.data || true);

        const msg =
          err?.response?.status === 400 && showError
            ? `${err?.response?.data?.message}.`
            : 'Houve um problema ao buscar os dados';

        if (showMessage) {
          message.error(msg);
        }

        return Promise.reject(err);
      } finally {
        setLoading(false);
      }
    },
    [clearData]
  );

  const post = useCallback(
    async ({ url, payload, config, showError = true, showMessage = true }) => {
      try {
        setError(undefined);
        setLoading(true);

        const response = await api.post(url, payload, config);
        setData(response?.data);

        return Promise.resolve(response?.data);
      } catch (err) {
        setError(err?.response?.data || true);

        const msg =
          err?.response?.status === 400 && showError
            ? `${err?.response?.data?.message}.`
            : 'Houve um problema ao realizar a ação';

        if (showMessage) {
          message.error(msg);
        }

        return Promise.reject(err);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const patch = useCallback(async ({ url, payload, config, showError }) => {
    try {
      setError(undefined);
      setLoading(true);

      const response = await api.patch(url, payload, config);
      setData(response?.data);

      return Promise.resolve(response?.data);
    } catch (err) {
      setError(err?.response?.data || true);

      const msg =
        err?.response?.status === 400 && showError
          ? `${err?.response?.data?.message}.`
          : 'Houve um problema ao realizar a ação';
      message.error(msg);

      return Promise.reject(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const put = useCallback(async ({ url, payload, config, showError }) => {
    try {
      setError(undefined);
      setLoading(true);

      const response = await api.put(url, payload, config);
      setData(response?.data);

      return Promise.resolve(response?.data);
    } catch (err) {
      setError(err?.response?.data || true);

      const msg =
        err?.response?.status === 400 && showError
          ? `${err?.response?.data?.message}.`
          : 'Houve um problema ao realizar a ação';
      message.error(msg);

      return Promise.reject(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const _delete = useCallback(async ({ url, config, showError }) => {
    try {
      setError(undefined);
      setLoading(true);

      const response = await api.delete(url, config);
      setData(response?.data);

      return Promise.resolve(response?.data);
    } catch (err) {
      setError(err?.response?.data || true);

      const msg =
        err?.response?.status === 400 && showError
          ? `${err?.response?.data?.message}.`
          : 'Houve um problema ao realizar a ação';
      message.error(msg);

      return Promise.reject(err);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    data,
    error,
    loading,
    clearData,
    get,
    post,
    put,
    patch,
    delete: _delete,
  };
};

export default useFetch;
