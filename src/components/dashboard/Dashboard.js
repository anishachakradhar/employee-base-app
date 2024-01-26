import { faBuilding, faBullhorn, faHeart, faHome, faTh } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { WFO } from 'constants/appConstant';
import { ANNOUNCEMENTS_INDEX, DAILY_HEALTH_DECLARATION, WFH, WFOS_INDEX } from 'constants/routes';
import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  return (
    <div>
      <div className="header bg-primary pb-6">
        <div className="container-fluid">
          <div className="header-body">
            <div className="row align-items-center py-4">
              <div className="col-lg-6 col-7">
                <h6 className="h2 text-white mb-5">
                  <FontAwesomeIcon icon={faTh} className="dashboard-icon mr-2" />
                  Dashboard
                </h6>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container-fluid mt-3">
        <div className="row">
          <div className="col-md-4 col-lg-3">
            <Link className="p-4 card dashboard-card" to={WFH}>
              <div className="d-flex align-items-center">
                <FontAwesomeIcon icon={faHome} className="brand-blue info-icon mr-2" />
                <div>Work From Home</div>
              </div>
            </Link>
          </div>
          <div className="col-md-4 col-lg-3">
            <Link className="p-4 card dashboard-card" to={WFOS_INDEX}>
              <div className="d-flex align-items-center">
                <FontAwesomeIcon icon={faBuilding} className="brand-blue info-icon mr-2" />
                <div>Work From Office</div>
              </div>
            </Link>
          </div>
          <div className="col-md-4 col-lg-3">
            <Link className="p-4 card dashboard-card" to={ANNOUNCEMENTS_INDEX}>
              <div className="d-flex align-items-center">
                <FontAwesomeIcon icon={faBullhorn} className="brand-blue info-icon mr-2" />
                <div>Announcements</div>
              </div>
            </Link>
          </div>
          <div className="col-md-4 col-lg-3">
            <Link className="p-4 card dashboard-card" to={DAILY_HEALTH_DECLARATION}>
              <div className="d-flex align-items-center">
                <FontAwesomeIcon icon={faHeart} className="brand-blue info-icon mr-2" />
                <div>Daily Health Declaration</div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
