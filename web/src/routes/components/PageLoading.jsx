import React from 'react';
import { Row, Spin } from 'antd';

const PageLoading = () => {
  return (
    <Row className="flex center full-height">
      <Spin
      // indicator={<Loader size="40px" color="#bdbdbd" />}
      // tip="Carregando dados do usuário..."
      />
    </Row>
  );
};

export default PageLoading;
