import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Row, Col, Table } from 'antd';
import { useQueryParams, StringParam, NumberParam } from 'use-query-params';

import { useFetch } from 'services/hooks';

// import { scrollToTop } from 'utils/scroll';

import initialFilterData from '../utils/initialFilterData';

const useTable = ({ rowKey, getParams, columns, queryParams }) => {
  const { data, loading, get } = useFetch();
  const [query, setQuery] = useQueryParams({
    page: NumberParam,
    _order: StringParam,
    _sort: StringParam,
    ...queryParams,
  });

  const [params, setParams] = useState(getParams);
  const [pagination, setPagination] = useState({
    current: query?.page || 1,
    pageSize: 20,
    total: 0,
    showTotal: (total, range) => `Exibindo ${range[0]} a ${range[1]} de ${total} itens`,
  });
  const [sortData, setSortData] = useState({
    _order: query?._order || '',
    _sort: query?._sort || '',
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
            ...sortData,
            ...filterData,
            ...params.config.params,
          },
        },
        showMessage: false,
      });

      setPagination((oldState) => ({
        ...oldState,
        current,
        pageSize,
        total: res.totalItems,
      }));
    },
    [get, params, pagination.pageSize, sortData, filterData]
  );

  const refreshList = useCallback(() => {
    fetch(pagination.current || 1);
  }, [fetch, pagination]);

  const updateParams = useCallback((newParams) => {
    setParams(newParams);
  }, []);

  useEffect(() => {
    if (!data) return;

    fetch(pagination.current || 1);
    setQuery({ page: pagination.current });
  }, [pagination.current, sortData]); // eslint-disable-line react-hooks/exhaustive-deps

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

  const onChange = useCallback(
    (_pagination, __, sorter) => {
      if (_pagination) {
        setPagination(_pagination);
      }

      const getSorterParams = (sort) => {
        if (!sort)
          return {
            _order: '',
            _sort: '',
          };

        const { columnKey } = sort;

        const result = {
          _order: '',
          _sort: columnKey || '',
        };

        if (sort.order === 'ascend') {
          result._order = '1';
        } else if (sort.order === 'descend') {
          result._order = '-1';
        }

        return result;
      };

      let newSortData = {};

      if (Array.isArray(sorter)) {
        const _order = [];
        const _sort = [];

        sorter.forEach((sorterItem) => {
          const result = getSorterParams(sorterItem);
          _order.push(result._order);
          _sort.push(result._sort);
        });

        newSortData = {
          _order: _order.join(';'),
          _sort: _sort.join(';'),
        };
      } else {
        newSortData = getSorterParams(sorter);
      }

      setSortData(newSortData);
      setQuery(
        newSortData._order ? newSortData : { _order: undefined, _sort: undefined }
      );
    },
    [setQuery]
  );

  const columnsFormatted = useMemo(() => {
    const _order = query?._order?.split(';');
    const _sort = query?._sort?.split(';');

    if (!_order) return [...columns];

    const joinedSortParams = _order.map((_o, i) => ({ _order: _o, _sort: _sort[i] }));

    const newColumns = columns.map((c) => {
      if (_sort.includes(c.key) || _sort.includes(c.dataIndex)) {
        const sp = joinedSortParams[_sort.indexOf(c.key || c.dataIndex)];

        return {
          ...c,
          defaultSortOrder: sp._order === '1' ? 'ascend' : 'descend',
        };
      }

      return c;
    });

    return [...newColumns];
  }, [query, columns]);

  const tableContent = useMemo(
    () =>
      columnsFormatted && (
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          <Col span={24}>
            <Table
              columns={[...columnsFormatted]}
              dataSource={data ? data.docs : []}
              loading={loading}
              onChange={onChange}
              pagination={pagination}
              showSorterTooltip={false}
              rowKey={rowKey} // identificação única de cada row
            />
          </Col>
        </Row>
      ),
    [columnsFormatted, data, loading, onChange, pagination, rowKey]
  );

  return {
    data,
    tableContent,
    setFilterData,
    refreshList,
    updateParams,
  };
};

export default useTable;
