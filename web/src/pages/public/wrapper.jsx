import React from 'react';
import { Layout } from 'antd';

// import logo from 'assets/images/logo.svg';

import './styles.less';

const { Content } = Layout;

const Wrapper = ({ children }) => {
  return (
    <Layout
      id="public-wrapper-component"
      className="app-layout auth-wrapper"
      style={{ height: '100vh' }}
    >
      <Content className="layout-content container-wrap">
        {children}
        {/* <Row className="no-mrg-horizon height-100"> */}
        {/* <Col xs={24} sm={24} md={14} lg={10}>
            <Row align="middle" justify="center" className="mrg-top-75">
              <Row className="auth-form">
                <Col span={24}>
                  <Divider className="mrg-vertical-30" />
                </Col>
                <Col span={24}>
                  <Space direction="vertical" size="large" className="auth-form-content">
                    {children}
                  </Space>
                </Col>
              </Row>
            </Row>
          </Col> */}

        {/* <Col className="right-panel" xs={0} sm={0} md={10} lg={14}>
            <Row align="middle" justify="end">
              <Col span={12} pull={3} className="mrg-top-75 text-right" />
            </Row>
          </Col> */}
        {/* </Row> */}
      </Content>
    </Layout>
  );
};

export default Wrapper;
