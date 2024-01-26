import { DASHBOARD } from 'constants/routes';
import React from 'react';
import { useSelector } from 'react-redux';
import { Redirect, Route } from 'react-router-dom';

export const GuestRoute = ({ component: Component, ...props }) => {
  const { isAuthenticated } = useSelector((state) => state.data.auth);
  const redirectPath = props.location.state?.from || DASHBOARD;

  if (isAuthenticated) {
    return <Redirect to={{ pathname: redirectPath }}></Redirect>;
  }

  return <Route component={Component} {...props} />;
};
