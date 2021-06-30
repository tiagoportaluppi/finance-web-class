import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';

import { useAuth } from 'hooks/auth';

import Loading from './components/PageLoading';

const RouteWrapper = ({ isPrivate, component: Component, ...rest }) => {
  const { user, getLoggedUser } = useAuth();
  const authenticated = useAuth().isAuthenticated();

  useEffect(() => {
    if (user || !authenticated) return;

    getLoggedUser();
  }, [authenticated, getLoggedUser, user]);

  return user || !authenticated ? (
    <Route
      {...rest}
      render={({ location }) => {
        if (isPrivate !== authenticated) {
          if (isPrivate) {
            return <Redirect to={{ pathname: '/signin', state: { from: location } }} />;
          }

          const pathname = '/dashboard';
          const search = '';

          // Redirecting to its respective landing page
          return <Redirect to={{ pathname, search, state: { from: location } }} />;
        }

        return <Component />;
      }}
    />
  ) : (
    <Loading />
  );
};

RouteWrapper.propTypes = {
  isPrivate: PropTypes.bool,
  component: PropTypes.oneOfType([PropTypes.element, PropTypes.func]).isRequired,
};

RouteWrapper.defaultProps = {
  isPrivate: false,
};

export default RouteWrapper;
