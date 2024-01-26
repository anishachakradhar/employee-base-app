import React from 'react';
import { Provider } from 'react-redux';

import Toast from './components/common/toast';
import 'react-toastify/dist/ReactToastify.min.css';

import './App.css';

import Routes from 'routes';
import store from 'store/store';
import history from 'utils/history';

function App() {
  return (
    <div className="main-container">
      <Provider store={store}>
        <Routes history={history} />
        <Toast />
      </Provider>
    </div>
  );
}

export default App;
