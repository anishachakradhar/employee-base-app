import { LOGIN } from 'constants/routes';
import React from 'react';
import { useSelector } from 'react-redux';
import { Redirect, Route } from 'react-router-dom';

export const AuthenticatedRoute = ({ component: Component, path, ...props }) => {
  const { isAuthenticated } = useSelector((state) => state.data.auth);

  if (!isAuthenticated) {
    return <Redirect to={{ pathname: LOGIN, state: { from: props.location.pathname } }}></Redirect>;
  }

  return <Route path={path} component={Component} {...props} />;
};
