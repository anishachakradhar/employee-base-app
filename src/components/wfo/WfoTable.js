import { withRouter } from 'react-router';
import Pagination from 'react-js-pagination';
import { Link, NavLink } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDoubleLeft, faAngleDoubleRight, faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';

import WfoStatus from './WfoStatus';
import WfoHeader from './WfoHeader';
import { format } from 'utils/datetime';
import { Loading } from 'components/loading';
import { getWfos } from 'services/wfoServices';
import { WFO_STATUS } from 'constants/appConstant';
import { DEFAULT_DATE_TIME_FORMAT, WFO } from 'constants/appConstant';
import { WFOS_APPLY, WFOS_INDEX, WFOS_REQUESTED } from 'constants/routes';

const WfoTable = () => {
  const [wfos, setWfos] = useState([]);
  const [meta, setMeta] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchWfos = async (page = 1) => {
    try {
      setIsLoading(true);
      const data = await getWfos({ page });

      setWfos(data.data);
      delete data.data;
      setMeta({ ...data });
    } catch (error) {
      // TODO: Handle error
    } finally {
      setIsLoading(false);
    }
  };

  const { currentPage, perPage, total } = meta;

  useEffect(() => {
    fetchWfos();
  }, []);

  return (
    <div>
      <WfoHeader heading={WFO}>
        <div className="card col-12">
          <div className="row">
            <div className="col-12">
              <NavLink
                exact
                activeStyle={{ background: '#94c82a' }}
                className="btn btn-outline-success btn-sm m-2"
                to={WFOS_INDEX}
              >
                My History
              </NavLink>
              <NavLink
                exact
                activeStyle={{ background: '#94c82a' }}
                className="btn btn-outline-success btn-sm m-2"
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
            <div className="card-header row border-0">
              <div className="col-6">
                <h3 className="mb-0 text-body">Your Work from Office History</h3>
              </div>
              <div className="col-6 text-right">
                <Link className="btn btn-sm btn-primary btn-custom-size" to={{ pathname: WFOS_APPLY }}>
                  Apply WFO
                </Link>
              </div>
            </div>
            {isLoading ? (
              <Loading />
            ) : (
              <div className="table-responsive">
                <table className="table align-items-center table-flush">
                  <thead>
                    <tr>
                      <th scope="col" className="sort">
                        WFO ID
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
                        <tr key={index}>
                          <th scope="row">
                            <div className="media align-items-center">
                              <div className="media-body">
                                <span className="name mb-0 text-sm">{index + 1}</span>
                              </div>
                            </div>
                          </th>
                          <th scope="row">
                            <div className="media align-items-center">
                              <div className="media-body">
                                <span className="name mb-0 text-sm">{format(wfo.attendanceDate)} </span>
                              </div>
                            </div>
                          </th>
                          <td>{format(wfo.requestedOn, DEFAULT_DATE_TIME_FORMAT)}</td>
                          <td>{wfo.reportedOn ? format(wfo.reportedOn, DEFAULT_DATE_TIME_FORMAT) : '-'}</td>
                          <td>
                            <WfoStatus status={wfo.status} />
                          </td>
                          <td>
                            <Link
                              type="button"
                              className="btn btn-sm btn-outline-success"
                              to={{ pathname: `/wfos/${wfo.id}` }}
                            >
                              {WFO_STATUS[wfo.status] === WFO_STATUS.REQUEST_APPROVED ? 'SEND REPORT' : 'VIEW'}
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

export default withRouter(WfoTable);
