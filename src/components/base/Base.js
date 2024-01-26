import React from 'react';
import { Link } from 'react-router-dom';

import { LogoFull } from 'assets/img/images';

const Base = () => {
  return (
    <div>
      <div className="custom-login-div text-right">
        <Link to="/login" className="custom-login">
          Login
        </Link>
      </div>
      <div className="logo__container">
        <img className="logo--sm" src={LogoFull} alt="Technorio Logo"></img>
      </div>
    </div>
  );
};

export default Base;
