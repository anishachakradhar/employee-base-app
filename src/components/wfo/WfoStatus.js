import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faSadTear } from '@fortawesome/free-solid-svg-icons';

import { WFH_STATUS } from 'constants/appConstant';

const WfhStatus = ({ status }) => {
  if (status === 'REPORT_APPROVED') {
    return (
      <>
        <FontAwesomeIcon icon={faCheck} className="mr-1 text-success" />
        <span className="badge badge-dot mr-4">
          <span className="status">{WFH_STATUS[status]}</span>
        </span>
      </>
    );
  }

  const warning = ['REQUESTED', 'REPORT_SUBMITTED'];
  const success = ['REQUEST_APPROVED', 'REPORT_APPROVED'];
  const error = ['REQUEST_REJECTED', 'REPORT_REJECTED', 'CANCELLED'];

  if (error.includes(status)) {
    return (
      <>
        <FontAwesomeIcon icon={faSadTear} className="mr-1 text-danger" />
        <span className="badge badge-dot mr-4">
          <span className="status">{WFH_STATUS[status]}</span>
        </span>
      </>
    );
  }

  const dotColor = warning.includes(status) ? 'bg-primary' : success.includes(status) ? 'bg-success' : 'bg-neutral';

  return (
    <>
      <span className="badge badge-dot mr-4">
        <i className={`${dotColor} mr-2`}></i>
        <span className="status">{WFH_STATUS[status]}</span>
      </span>
    </>
  );
};

export default WfhStatus;
