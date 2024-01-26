import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { getUserFullName } from 'services/userServices';

const Navbar = () => {
  const { user: authUser } = useSelector((state) => state.data.auth);
  const userName = authUser && getUserFullName(authUser);

  return (
    <nav className="navbar navbar-top navbar-expand navbar-dark border-bottom">
      <div className="container-fluid">
        <div className="collapse navbar-collapse flex-row-reverse" id="navbarSupportedContent">
          <ul className="navbar-nav align-items-center  ml-auto ml-md-0 ">
            <li className="nav-item dropdown">
              {userName && (
                <Link className="nav-link pr-0" to="#">
                  <div className="media align-items-center">
                    <span className="avatar avatar-sm rounded-circle">{`${authUser.firstName[0]}${authUser.lastName[0]}`}</span>
                    <div className="media-body  ml-2  d-none d-lg-block">
                      <span className="mb-0 text-sm text-blue-brand font-weight-bold">{userName}</span>
                    </div>
                  </div>
                </Link>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
