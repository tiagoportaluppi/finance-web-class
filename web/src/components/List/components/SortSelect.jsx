import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Select } from 'antd';
import { useQueryParams, StringParam } from 'use-query-params';

const { Option } = Select;

const SortSelect = ({ matchPeople, matchCompanies, ...rest }) => {
  const [query, setQuery] = useQueryParams({
    _order: StringParam,
    _sort: StringParam,
  });

  const [value, setValue] = useState(() => {
    const { _order, _sort } = query;

    if (_sort === 'createdAt') {
      if (_order === '1') return 'old';
      return 'recent';
    }

    if (_sort === 'basicData.name' || _sort === 'basicData.officialName') {
      if (_order === '-1') return 'z-a';
      return 'a-z';
    }

    return 'updatedRecent';
  });

  useEffect(() => {
    setValue(() => {
      const { _order, _sort } = query;

      if (_sort === 'createdAt') {
        if (_order === '1') return 'old';
        return 'recent';
      }

      if (_sort === 'basicData.name' || _sort === 'basicData.officialName') {
        if (_order === '-1') return 'z-a';
        return 'a-z';
      }

      return 'updatedRecent';
    });
  }, [query]);

  const handleOnChange = useCallback(
    (newValue) => {
      if (newValue === 'updatedRecent') {
        setQuery({ _order: undefined, _sort: undefined });
      }
      if (newValue === 'old') {
        setQuery({ _order: 1, _sort: 'createdAt' });
      }
      if (newValue === 'recent') {
        setQuery({ _order: -1, _sort: 'createdAt' });
      }
      if (newValue === 'a-z') {
        setQuery({
          _order: 1,
          _sort: `${matchPeople ? 'basicData.name' : 'basicData.officialName'}`,
        });
      }
      if (newValue === 'z-a') {
        setQuery({
          _order: -1,
          _sort: `${matchCompanies ? 'basicData.officialName' : 'basicData.name'}`,
        });
      }
    },
    [setQuery, matchPeople, matchCompanies]
  );

  return (
    <Select
      bordered={false}
      style={{ minWidth: 170, fontSize: '14px' }}
      placeholder="Últimos atualizados"
      onChange={handleOnChange}
      value={value}
      className="text-dark"
      {...rest}
    >
      <Option value="a-z">Alfabética (A - Z)</Option>
      <Option value="z-a">Alfabética (Z - A)</Option>
      <Option value="recent">Mais recente</Option>
      <Option value="old">Mais antigo</Option>
      <Option value="updatedRecent">Últimos atualizados</Option>
    </Select>
  );
};

SortSelect.propTypes = {
  matchPeople: PropTypes.bool.isRequired,
  matchCompanies: PropTypes.bool.isRequired,
};

export default SortSelect;
