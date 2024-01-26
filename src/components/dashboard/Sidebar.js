import React from 'react';
import { Link } from 'react-router-dom';
import { faHome, faUsers, faHeart, faBuilding, faBullhorn, faCalendar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { LogoFull } from 'assets/img/images';
import {
  ANNOUNCEMENTS_INDEX,
  ATTENDANCES_EXPORT,
  DAILY_HEALTH_DECLARATION,
  DASHBOARD,
  USER_INDEX,
  WFH,
  WFOS_INDEX
} from 'constants/routes';
import { useSelector } from 'react-redux';

const Sidebar = () => {
  const { user: authUser } = useSelector((state) => state.data.auth);
  const isAdmin = authUser?.userAttributes?.isAdmin;

  return (
    <nav className="sidenav navbar navbar-vertical  fixed-left  navbar-expand-xs" id="sidenav-main">
      <div className="scrollbar-inner">
        <div className="sidenav-header  align-items-center">
          <Link className="navbar-brand" to={{ pathname: DASHBOARD }}>
            <img src={LogoFull} className="navbar-brand-img" alt="Technorio Logo" />
          </Link>
        </div>
        <div className="navbar-inner">
          <div className="collapse navbar-collapse" id="sidenav-collapse-main">
            <h6 className="navbar-heading p-0 text-muted">
              <span className="docs-normal">Operations</span>
            </h6>
            <ul className="navbar-nav mb-md-3">
              <li className="nav-item">
                <Link className="nav-link" to={{ pathname: WFH }}>
                  <FontAwesomeIcon icon={faHome} className="brand-blue dashboard-icon" />
                  <span className="nav-link-text">Work From Home</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to={{ pathname: WFOS_INDEX }}>
                  <FontAwesomeIcon icon={faBuilding} className="brand-blue dashboard-icon" />
                  <span className="nav-link-text">Work From Office</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to={{ pathname: DAILY_HEALTH_DECLARATION }}>
                  <FontAwesomeIcon icon={faHeart} className="brand-blue dashboard-icon" />
                  <span className="nav-link-text">Daily Health Declaration</span>
                </Link>
              </li>
              {isAdmin && (
                <li className="nav-item">
                  <Link className="nav-link" to={{ pathname: USER_INDEX }}>
                    <FontAwesomeIcon icon={faUsers} className="brand-blue dashboard-icon" />
                    <span className="nav-link-text">Employees</span>
                  </Link>
                </li>
              )}
              <li className="nav-item">
                <Link className="nav-link" to={{ pathname: ANNOUNCEMENTS_INDEX }}>
                  <FontAwesomeIcon icon={faBullhorn} className="brand-blue dashboard-icon" />
                  <span className="nav-link-text">Announcements</span>
                </Link>
              </li>
              {isAdmin && (
                <li className="nav-item">
                  <Link className="nav-link" to={{ pathname: ATTENDANCES_EXPORT }}>
                    <FontAwesomeIcon icon={faCalendar} className="brand-blue dashboard-icon" />
                    <span className="nav-link-text">Attendances</span>
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;
