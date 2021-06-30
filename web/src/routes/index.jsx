import React from 'react';
import { Switch, Redirect } from 'react-router-dom';

import Login from 'pages/public/Login';

import Dashboard from 'pages/private/Dashboard';
import Categories from 'pages/private/Categories';

import Route from './Route';

const Routes = () => (
  <Switch>
    {/* Public routes */}
    <Route path="/signin" component={Login} />

    {/* Private routes */}
    <Route path="/dashboard" exact component={Dashboard} isPrivate />
    <Route path="/categories" exact component={Categories} isPrivate />

    <Redirect to="/dashboard" />
  </Switch>
);

export default Routes;
