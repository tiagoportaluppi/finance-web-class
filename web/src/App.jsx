import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { QueryParamProvider } from 'use-query-params';
import { ConfigProvider } from 'antd';
import ptBR from 'antd/es/locale/pt_BR';
// import moment from 'moment';
import 'moment/locale/pt-br';

import './assets/less/styles.less';

import AppProvider from 'hooks';
import HttpInterceptor from 'utils/httpInterceptor';
import validateMessages from 'utils/formValidateMessages';

import Routes from './routes';

const App = () => (
  <BrowserRouter>
    <QueryParamProvider ReactRouterRoute={Route}>
      <AppProvider>
        <ConfigProvider form={{ validateMessages }} locale={ptBR}>
          <Routes />
        </ConfigProvider>
        <HttpInterceptor />
      </AppProvider>
    </QueryParamProvider>
  </BrowserRouter>
);

export default App;
