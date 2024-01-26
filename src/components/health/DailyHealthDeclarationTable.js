import { Link } from 'react-router-dom';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import React, { useCallback, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { dhdList } from 'services/dhdServices';
import { DAILY_HEALTH_DECLARATION_NEW } from 'constants/routes';

const DailyHealthDeclarationTable = () => {
  const [dhds, setDhds] = useState();

  const fetchAllDhds = useCallback(async () => {
    const { data } = await dhdList();
    return data;
  }, []);

  useEffect(() => {
    fetchAllDhds().then((data) => {
      setDhds(data);
    });
  }, []);

  return (
    <div>
      <div className="header bg-primary pb-6">
        <div className="container-fluid">
          <div className="header-body">
            <div className="row align-items-center py-4">
              <div className="col-lg-6 col-7">
                <h6 className="h2 text-white mb-5">
                  <FontAwesomeIcon icon={faHeart} className="dashboard-icon mr-2" />
                  DAILY HEALTH DECLARATION
                </h6>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container-fluid mt--6">
        <div className="row">
          <div className="card col-12">
            <div className="card-header row border-0">
              <div className="col-6">
                <h3 className="mb-0 text-body">Your Daily Health Declaration History</h3>
              </div>
              <div className="col-6 text-right">
                <Link
                  className="btn btn-sm btn-success btn-custom-size"
                  to={{ pathname: DAILY_HEALTH_DECLARATION_NEW }}
                >
                  New Report
                </Link>
              </div>
            </div>
            <div className="table-responsive">
              <table className="table align-items-center table-flush">
                <thead>
                  <tr>
                    <th scope="col" className="sort">
                      DHD ID
                    </th>
                    <th scope="col" className="sort">
                      Submitted Date
                    </th>
                    <th scope="col"></th>
                  </tr>
                </thead>
                <tbody className="list">
                  {dhds &&
                    dhds.map((dhd, index) => (
                      <tr key={index}>
                        <th scope="row">
                          <div className="media align-items-center">
                            <div className="media-body">
                              <span className="name mb-0 text-sm">{dhd.id}</span>
                            </div>
                          </div>
                        </th>
                        <th scope="row">
                          <div className="media align-items-center">
                            <div className="media-body">
                              <span className="name mb-0 text-sm">{dhd.declarationDate.split('+')[0]}</span>
                            </div>
                          </div>
                        </th>
                        <td>
                          <Link
                            type="button"
                            className="btn btn-sm btn-outline-success"
                            to={{ pathname: `/daily-health-declaration/${dhd.id}` }}
                          >
                            {'VIEW'}
                          </Link>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default DailyHealthDeclarationTable;
