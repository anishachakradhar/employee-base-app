import { withRouter } from 'react-router';
import Pagination from 'react-js-pagination';
import { Link, NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import React, { useCallback, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDoubleLeft, faAngleDoubleRight, faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';

import WfhStatus from './WfhStatus';
import WfhHeader from './WfhHeader';
import { WFH } from 'constants/appConstant';
import { Loading } from 'components/loading';
import { WFH_STATUS } from 'constants/appConstant';
import { fetchWfh, sendWfhReport } from 'actions/wfhActions';
import { WFH as WFH_ROUTE, WFH_APPLY, WFH_REQUESTED } from 'constants/routes';

const WfhTable = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);

  const wfhList = useSelector((state) => state.data.wfh.wfhList);

  const { currentPage, perPage, total } = wfhList;

  const dispatchFetchWfh = useCallback(
    (page = 1) => {
      try {
        setIsLoading(true);
        dispatch(fetchWfh({ page }));
      } catch (error) {
        // TODO: Handle error
      } finally {
        setIsLoading(false);
      }
    },
    [dispatch]
  );

  useEffect(() => {
    dispatchFetchWfh();
  }, [dispatchFetchWfh]);

  const handleSendReport = (id) => {
    dispatch(sendWfhReport(id));
  };

  return (
    <div>
      <WfhHeader heading={WFH}>
        <div className="card col-12">
          <div className="row">
            <div className="col-12">
              <NavLink
                exact
                activeStyle={{ background: '#94c82a' }}
                className="btn btn-outline-success btn-sm m-2"
                to={WFH_ROUTE}
              >
                My History
              </NavLink>
              <NavLink
                exact
                activeStyle={{ background: '#94c82a' }}
                className="btn btn-outline-success btn-sm m-2"
                to={WFH_REQUESTED}
              >
                Approve WFH
              </NavLink>
            </div>
          </div>
        </div>
      </WfhHeader>
      <div className="container-fluid mt--6">
        <div className="row">
          <div className="card col-12">
            <div className="card-header row border-0">
              <div className="col-6">
                <h3 className="mb-0 text-body">Your Work from Home History</h3>
              </div>
              <div className="col-6 text-right">
                <Link className="btn btn-sm btn-primary btn-custom-size" to={{ pathname: WFH_APPLY }}>
                  Apply WFH
                </Link>
              </div>
            </div>
            {isLoading && !wfhList.length ? (
              <Loading />
            ) : (
              <div className="table-responsive">
                <table className="table align-items-center table-flush">
                  <thead>
                    <tr>
                      <th scope="col" className="sort">
                        WFH ID
                      </th>
                      <th scope="col" className="sort">
                        WFH Date
                      </th>
                      <th scope="col" className="sort">
                        Requested At
                      </th>
                      <th scope="col" className="sort">
                        Reported At
                      </th>
                      <th scope="col" className="sort">
                        Status
                      </th>
                      <th scope="col"></th>
                    </tr>
                  </thead>
                  <tbody className="list">
                    {wfhList.data &&
                      wfhList.data.map((wfh, index) => (
                        <tr key={index}>
                          <th scope="row">
                            <div className="media align-items-center">
                              <div className="media-body">
                                <span className="name mb-0 text-sm">{wfh.id}</span>
                              </div>
                            </div>
                          </th>
                          <th scope="row">
                            <div className="media align-items-center">
                              <div className="media-body">
                                <span className="name mb-0 text-sm">{wfh.attendanceDate}</span>
                              </div>
                            </div>
                          </th>
                          <td>{wfh.requestedOn}</td>
                          <td>{wfh.reportedOn ? wfh.reportedOn : '-'}</td>
                          <td>
                            <WfhStatus status={wfh.status} />
                          </td>
                          <td>
                            <Link
                              type="button"
                              className="btn btn-sm btn-outline-success"
                              onClick={() => handleSendReport(wfh.id)}
                              to={{ pathname: `/wfh/${wfh.id}` }}
                            >
                              {WFH_STATUS[wfh.status] === WFH_STATUS.REQUEST_APPROVED ? 'SEND REPORT' : 'VIEW'}
                            </Link>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
                <div className="mt-3 d-flex justify-content-end">
                  <Pagination
                    activePage={currentPage}
                    itemsCountPerPage={perPage}
                    totalItemsCount={total ?? 0}
                    onChange={(page) => dispatchFetchWfh(page)}
                    itemClass="page-item"
                    linkClass="page-link"
                    prevPageText={<FontAwesomeIcon icon={faAngleLeft} />}
                    nextPageText={<FontAwesomeIcon icon={faAngleRight} />}
                    firstPageText={<FontAwesomeIcon icon={faAngleDoubleLeft} />}
                    lastPageText={<FontAwesomeIcon icon={faAngleDoubleRight} />}
                    hideDisabled={false}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default withRouter(WfhTable);
