import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';

const WfhHeader = ({ heading, icon: Icon, ...rest }) => {
  return (
    <div className="header bg-primary pb-6">
      <div className="container-fluid">
        <div className="header-body">
          <div className="row align-items-center py-4">
            <div className="col-lg-6 col-7">
              <h6 className="h2 text-white mb-5">
                <FontAwesomeIcon icon={faHome} className="dashboard-icon mr-2" />
                {heading}
              </h6>
            </div>
          </div>
          <div className="row align-items-center">{rest.children}</div>
        </div>
      </div>
    </div>
  );
};

WfhHeader.propTypes = {
  heading: PropTypes.string.isRequired
};

export default WfhHeader;
