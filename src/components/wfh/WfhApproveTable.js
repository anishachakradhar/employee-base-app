import { withRouter } from 'react-router';
import Pagination from 'react-js-pagination';
import { NavLink, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import React, { useCallback, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDoubleLeft, faAngleDoubleRight, faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';

import WfhStatus from './WfhStatus';
import WfhHeader from './WfhHeader';
import { WFH } from 'constants/appConstant';
import { Loading } from 'components/loading';
import { setError } from 'actions/errorActions';
import { getUserFullName } from 'services/userServices';
import { WFH as WFH_ROUTE, WFH_REQUESTED } from 'constants/routes';
import { fetchRequestedWfhs, updateWfhStatus } from 'actions/wfhActions';

const WfhApproveTable = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(true);

  const requestedWfhs = useSelector((state) => state.data.wfh.requestedWfhs);

  const { currentPage, perPage, total } = requestedWfhs;

  const dispatchFetchRequestedWfhs = useCallback(
    (page = 1) => {
      try {
        setIsLoading(true);
        dispatch(fetchRequestedWfhs({ page }));
      } catch (error) {
        // TODO: Handle error
      } finally {
        setIsLoading(false);
      }
    },
    [dispatch]
  );

  useEffect(() => {
    dispatchFetchRequestedWfhs();
  }, [dispatchFetchRequestedWfhs]);

  const handleRowClick = (wfhId) => {
    return history.push({
      pathname: `/wfh/${wfhId}`
    });
  };

  const handleUpdateStatus = async (e, wfhId, approve) => {
    e.stopPropagation();

    try {
      dispatch(updateWfhStatus({ wfhId, approve }));
    } catch (error) {
      const { data } = error.response;

      dispatch(setError(data));
    }
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
                className="btn btn-outline-primary btn-sm m-2"
                to={WFH_ROUTE}
              >
                My History
              </NavLink>
              <NavLink
                exact
                activeStyle={{ background: '#94c82a' }}
                className="btn btn-outline-primary btn-sm m-2"
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
            <div className="card-header border-0">
              <h3 className="mb-0 text-body">WFH REQUEST</h3>
            </div>
            {isLoading && !requestedWfhs.length ? (
              <Loading />
            ) : (
              <div className="table-responsive">
                <table className="table align-items-center table-flush table-hover">
                  <thead>
                    <tr>
                      <th scope="col" className="sort">
                        WFH ID
                      </th>
                      <th scope="col" className="sort">
                        Name
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
                    {requestedWfhs.data &&
                      requestedWfhs.data.map((wfh, index) => (
                        <tr key={index} onClick={() => handleRowClick(wfh.id)} className="pointer">
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
                                <span className="name mb-0 text-sm">{getUserFullName(wfh.user)}</span>
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
                            {(wfh.status === 'REQUESTED' || wfh.status === 'REPORT_SUBMITTED') && (
                              <>
                                <button
                                  className="btn btn-sm btn-outline-success"
                                  onClick={(e) => handleUpdateStatus(e, wfh.id, true)}
                                >
                                  APPROVE
                                </button>
                                <button
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={(e) => handleUpdateStatus(e, wfh.id, false)}
                                >
                                  REJECT
                                </button>
                              </>
                            )}
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
                    onChange={(page) => dispatchFetchRequestedWfhs(page)}
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

export default withRouter(WfhApproveTable);
