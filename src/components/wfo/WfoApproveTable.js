import { withRouter } from 'react-router';
import Pagination from 'react-js-pagination';
import { NavLink, useHistory } from 'react-router-dom';
import React, { useState, useCallback, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDoubleLeft, faAngleDoubleRight, faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';

import WfoStatus from './WfoStatus';
import WfoHeader from './WfoHeader';
import { format } from 'utils/datetime';
import { Loading } from 'components/loading';
import { getUserFullName } from 'services/userServices';
import { success, error as errorToast } from 'utils/toast';
import { WFOS_INDEX, WFOS_REQUESTED } from 'constants/routes';
import { DEFAULT_DATE_TIME_FORMAT, WFH_STATUS, WFO } from 'constants/appConstant';
import { updateWfoStatus, fetchRequestedWfos } from 'services/wfoServices';

const WfoApproveTable = () => {
  const [wfos, setWfos] = useState(null);
  const history = useHistory();
  const [meta, setMeta] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchWfos = useCallback(async (page = 1) => {
    try {
      setIsLoading(true);
      const data = await fetchRequestedWfos({ page });

      setWfos(data.data);
      delete data.data;
      setMeta({ ...data });
    } catch (error) {
      // TODO: Handle error
    } finally {
      setIsLoading(false);
    }
  }, []);

  const { currentPage, perPage, total } = meta;

  useEffect(() => {
    fetchWfos();
  }, []);

  const handleRowClick = (wfoId) => {
    return history.push({
      pathname: `/wfos/${wfoId}`
    });
  };

  const handleUpdateStatus = async (e, wfo, approved) => {
    e.stopPropagation();
    try {
      let updatedStatus = '';
      if (approved) {
        updatedStatus = wfo.status === 'REQUESTED' ? 'REQUEST_APPROVED' : 'REPORT_APPROVED';
      } else {
        updatedStatus = wfo.status === 'REQUESTED' ? 'REQUEST_REJECTED' : 'REPORT_REJECTED';
      }

      const updatedWfo = await updateWfoStatus(wfo.id, updatedStatus);

      const updatedWfos = wfos.map((wfo) => {
        if (wfo.id === updatedWfo.id) {
          return {
            ...wfo,
            status: updatedWfo.status
          };
        }
        return wfo;
      });

      setWfos(updatedWfos);

      success({ message: `WFO status updated to ${WFH_STATUS[updatedStatus]}. ` });
    } catch (error) {
      const { data } = error.response;
      const messages = data?.errors && Object.values(data?.errors)?.flat();

      errorToast({ message: messages?.[0] || data?.message });
    }
  };

  return (
    <div>
      <WfoHeader heading={WFO}>
        <div className="card col-12">
          <div className="row">
            <div className="col-12">
              <NavLink
                exact
                activeStyle={{ background: '#94c82a' }}
                className="btn btn-outline-primary btn-sm m-2"
                to={WFOS_INDEX}
              >
                My History
              </NavLink>
              <NavLink
                exact
                activeStyle={{ background: '#94c82a' }}
                className="btn btn-outline-primary btn-sm m-2"
                to={WFOS_REQUESTED}
              >
                Approve WFO
              </NavLink>
            </div>
          </div>
        </div>
      </WfoHeader>
      <div className="container-fluid mt--6">
        <div className="row">
          <div className="card col-12">
            <div className="card-header border-0">
              <h3 className="mb-0 text-body">WFO REQUEST</h3>
            </div>
            {isLoading ? (
              <Loading />
            ) : (
              <div className="table-responsive">
                <table className="table align-items-center table-flush table-hover">
                  <thead>
                    <tr>
                      <th scope="col" className="sort">
                        WFO ID
                      </th>
                      <th scope="col" className="sort">
                        Name
                      </th>
                      <th scope="col" className="sort">
                        WFO Date
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
                    {wfos &&
                      wfos.map((wfo, index) => (
                        <tr key={index} onClick={() => handleRowClick(wfo.id)} className="pointer">
                          <th scope="row">
                            <div className="media align-items-center">
                              <div className="media-body">
                                <span className="name mb-0 text-sm">{wfo.id}</span>
                              </div>
                            </div>
                          </th>
                          <th scope="row">
                            <div className="media align-items-center">
                              <div className="media-body">
                                <span className="name mb-0 text-sm">{getUserFullName(wfo.user)}</span>
                              </div>
                            </div>
                          </th>
                          <th scope="row">
                            <div className="media align-items-center">
                              <div className="media-body">
                                <span className="name mb-0 text-sm">{wfo.attendanceDate}</span>
                              </div>
                            </div>
                          </th>
                          <td>{format(wfo.requestedOn, DEFAULT_DATE_TIME_FORMAT)}</td>
                          <td>{wfo.reportedOn ? format(wfo.reportedOn, DEFAULT_DATE_TIME_FORMAT) : '-'}</td>
                          <td>
                            <WfoStatus status={wfo.status} />
                          </td>
                          <td>
                            {(wfo.status === 'REQUESTED' || wfo.status === 'REPORT_SUBMITTED') && (
                              <>
                                <button
                                  className="btn btn-sm btn-outline-success"
                                  onClick={(e) => handleUpdateStatus(e, wfo, true)}
                                >
                                  APPROVE
                                </button>
                                <button
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={(e) => handleUpdateStatus(e, wfo, false)}
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
                    totalItemsCount={total}
                    onChange={(page) => fetchWfos(page)}
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

export default withRouter(WfoApproveTable);
