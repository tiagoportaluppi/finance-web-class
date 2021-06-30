import React from 'react';
// import PropTypes from 'prop-types';
import { Layout, Menu } from 'antd';
import { NavLink } from 'react-router-dom';

import UserInfo from 'components/UserInfo';

const { Header, Content, Footer } = Layout;

const Wrapper = ({ children }) => {
  return (
    <Layout className="layout">
      <Header>
        <div className="logo">Finance App</div>
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['2']}
          style={{ float: 'left' }}
        >
          <Menu.Item>
            <NavLink to="/dashboard" className="nav-link" activeClassName="active">
              Início
            </NavLink>
          </Menu.Item>
          <Menu.Item>
            <NavLink to="/categories" className="nav-link" activeClassName="active">
              Categorias
            </NavLink>
          </Menu.Item>
        </Menu>
        <UserInfo />
      </Header>
      <Content style={{ padding: '0 50px' }}>{children}</Content>
      <Footer style={{ textAlign: 'center' }}>Finance app ©2021</Footer>
    </Layout>
  );
};

export default Wrapper;
