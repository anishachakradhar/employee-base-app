import { Route, Router, Switch } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import React, { useCallback, useEffect, useState } from 'react';

import Base from 'components/base/Base';
import HomeRouter from 'routes/wfhRouter';
import { setUser } from 'actions/authActions';
import MainHome from 'components/landing/Home';
import { LOGIN, BASE } from 'constants/routes';
import { getUser } from 'services/authServices';
import { FullPageLoading } from 'components/loading';
import { GuestRoute } from 'components/routes/GuestRoute';

const Main = (props) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);

  const authenticate = useCallback(async () => {
    try {
      const { data } = await getUser();

      dispatch(setUser(data));
    } catch (error) {
      // console.error(error.response?.data);
      // const data = error.response;
      // dispatch(setError(data));
    }
    setIsLoading(false);
  }, [dispatch]);

  useEffect(() => {
    authenticate();
  }, [authenticate]);

  return (
    <>
      {isLoading ? (
        <FullPageLoading />
      ) : (
        <Router history={props.history}>
          <Switch>
            <Route exact path={BASE} component={Base} />
            <GuestRoute exact path={LOGIN} component={MainHome} />
            <Route path={BASE} component={HomeRouter} />
          </Switch>
        </Router>
      )}
    </>
  );
};

export default Main;
