import React from 'react';

import Login from 'components/landing/Login';
import Navbar from 'components/landing/Navbar';
import Footer from 'components/landing/Footer';

const MainHome = () => {
  return (
    <div>
      <Navbar />
      <Login />
      <Footer />
    </div>
  );
};

export default MainHome;
