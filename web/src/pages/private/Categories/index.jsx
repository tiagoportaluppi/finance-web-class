import React from 'react';
import { Button, Space, Typography } from 'antd';

import { useTable } from 'components/List';
import useCategoriesCreate from './components/CategoriesCreate';

import Wrapper from '../wrapper';

import './styles.less';

const { Title } = Typography;

const Categories = () => {
  const columns = [
    {
      key: 'color',
      title: 'Cor',
      dataIndex: 'color',
      width: 100,
      render: (record) => (
        <div className="category-circle" style={{ backgroundColor: record }} />
      ),
    },
    {
      key: 'name',
      title: 'Nome',
      dataIndex: 'name',
    },
    {
      title: '',
      key: 'action',
      fixed: 'right',
      align: 'right',
      render: (text, record) => (
        <Space size="middle">
          <Button
            onClick={() => {
              console.log(record);
            }}
          >
            Editar
          </Button>
          <Button
            onClick={() => {
              console.log(text);
            }}
          >
            Excluir
          </Button>
        </Space>
      ),
    },
  ];

  const { tableContent, refreshList } = useTable({
    getParams: {
      url: '/categories',
      config: {
        params: {},
      },
    },
    columns,
  });

  const { openModal, CategoriesCreateModal } = useCategoriesCreate({ refreshList });

  return (
    <Wrapper id="categories-component">
      {CategoriesCreateModal}

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: '25px 0 15px 0',
        }}
      >
        <Title level={4}>Categorias - alterado</Title>
        <Button
          shape="round"
          type="primary"
          className="no-mrg-btm flex center"
          onClick={() => openModal()}
        >
          Nova categoria
        </Button>
      </div>
      <div className="site-layout-content">{tableContent}</div>
    </Wrapper>
  );
};

export default Categories;
