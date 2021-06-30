import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Spin, Pagination } from 'antd';
import { useQueryParams, StringParam, NumberParam } from 'use-query-params';
// import _ from 'lodash';

import { useFetch } from 'services/hooks';

// import { scrollToTop } from 'utils/scroll';

import { initialFilterData } from '../utils';

const useComponentList = ({
  component: Component,
  rowKey,
  getParams,
  queryParams,
  customDataParser,
  customModal,
}) => {
  const { data, loading, get, clearData } = useFetch();

  const [query, setQuery] = useQueryParams({
    page: NumberParam,
    _order: StringParam,
    _sort: StringParam,
    ...queryParams,
  });

  const [customParserData, setCustomParserData] = useState();
  const [customParserLoading, setCustomParserLoading] = useState(false);

  const [params, setParams] = useState(getParams);
  const [pagination, setPagination] = useState({
    current: query?.page || 1,
    pageSize: 10,
    total: 0,
    showTotal: (total, range) => `Exibindo ${range[0]} a ${range[1]} de ${total} itens`,
  });
  const [filterData, setFilterData] = useState(() => {
    return initialFilterData({ query, queryParams });
  });

  const fetch = useCallback(
    async (current) => {
      if (!params) return;

      // scrollToTop();

      const pageSize = pagination.pageSize || 20;

      const res = await get({
        url: params.url,
        config: {
          params: {
            _limit: pageSize,
            _offset: pageSize * (current - 1),
            ...filterData,
            ...params.config.params,
          },
        },
      });

      setPagination((oldState) => ({
        ...oldState,
        current,
        pageSize,
        total: res.totalItems,
      }));

      if (customDataParser) {
        setCustomParserLoading(true);

        setCustomParserData(await customDataParser(res));

        setCustomParserLoading(false);
      }
    },
    [get, params, pagination.pageSize, filterData, customDataParser]
  );

  const refreshList = useCallback(() => {
    fetch(pagination.current || 1);
  }, [fetch, pagination]);

  const updateParams = useCallback((newParams) => {
    setParams(newParams);
  }, []);

  // const emptyMessageData = useMemo(() => {
  //   const p = params?.config?.params || {};

  //   if (!_.isEmpty(p._search) || !_.isEmpty(filterData)) {
  //     return {
  //       description: `Nenhum resultado encontrado.`,
  //       type: 'search',
  //     };
  //   }

  //   return {
  //     description: 'Nenhum resultado encontrado.',
  //     type: 'empty',
  //   };
  // }, [params, filterData]);

  useEffect(() => {
    if (!data) return;

    fetch(pagination.current || 1);
    setQuery({ page: pagination.current });
  }, [pagination.current]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (pagination.current === 1 || !data) {
      refreshList();
      setQuery({ page: pagination.current });
      return;
    }

    setPagination((state) => ({
      ...state,
      current: 1,
    }));
    setQuery({ page: 1 });
  }, [params, filterData]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setQuery({ ...filterData });
  }, [filterData, setQuery]);

  const componentList = useMemo(
    () => (
      <div className="gx-position-relative mrg-top-30">
        {loading && (
          <div className="custom-loading-container">
            <Spin className="mrg-top-30" />
          </div>
        )}
        {data?.docs?.length > 0 ? (
          <>
            {data?.docs?.map((d) => (
              <Component
                key={d[rowKey]}
                data={d}
                customParserData={customParserData}
                customParserLoading={customParserLoading}
                customModal={customModal}
                refreshList={refreshList}
              />
            ))}
            <Pagination
              total={pagination.total}
              pageSize={pagination.pageSize}
              current={pagination.current}
              showTotal={(total, range) =>
                `Exibindo ${range[0]} à ${range[1]} de ${total} itens`
              }
              onChange={(page) => setPagination((state) => ({ ...state, current: page }))}
              showSizeChanger={false}
            />
          </>
        ) : (
          <span>Nenhum resultado encontrado</span>
        )}
      </div>
    ),
    [
      loading,
      data,
      pagination,
      rowKey,
      customParserData,
      customParserLoading,
      customModal,
      refreshList,
    ]
  );

  return {
    componentList,
    data,
    loading,
    // formattedData,
    setFilterData,
    refreshList,
    updateParams,
    clearData,
  };
};

export default useComponentList;
