import { withRouter } from 'react-router';
import Pagination from 'react-js-pagination';
import { Link, NavLink } from 'react-router-dom';
import React, { useState, useCallback, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDoubleLeft, faAngleDoubleRight, faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';

import http from 'utils/http';
import endpoints from 'constants/endpoints';
import { Loading } from 'components/loading';
import WfhHeader from 'components/wfh/WfhHeader';
import { EMPLOYEE, GET } from 'constants/appConstant';
import { getUserFullName } from 'services/userServices';
import { USER_CREATE, USER_INDEX } from 'constants/routes';

const UserTable = () => {
  const [users, setUsers] = useState();
  const [meta, setMeta] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAllUsers = useCallback(async (page = 1) => {
    try {
      setIsLoading(true);

      const { data } = await http(GET, endpoints.users.all, { params: { page } });

      setUsers(data.data);
      setMeta(data.meta);
    } catch (error) {
      // TODO: Handle error
    } finally {
      setIsLoading(false);
    }
  }, []);

  const { current_page, per_page, total } = meta;

  useEffect(() => {
    fetchAllUsers();
  }, []);

  return (
    <div>
      <WfhHeader heading={EMPLOYEE}>
        <div className="card col-12">
          <div className="row">
            <div className="col-12">
              <NavLink
                exact
                activeStyle={{ background: '#94c82a' }}
                className="btn btn-outline-primary btn-sm m-2"
                to={USER_INDEX}
              >
                All
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
                <h3 className="mb-0 text-body">All Employees</h3>
              </div>
              <div className="col-6 text-right">
                <Link className="btn btn-sm btn-success btn-custom-size" to={{ pathname: USER_CREATE }}>
                  Add Employee
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
                        S.N
                      </th>
                      <th scope="col" className="sort">
                        Name
                      </th>
                      <th scope="col" className="sort">
                        Employee Id
                      </th>
                      <th scope="col"></th>
                    </tr>
                  </thead>
                  <tbody className="list">
                    {users &&
                      users.map((user, index) => (
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
                                <span className="name mb-0 text-sm">{getUserFullName(user)}</span>
                              </div>
                            </div>
                          </th>
                          <th scope="row">
                            <div className="media align-items-center">
                              <div className="media-body">
                                <span className="name mb-0 text-sm">{user.userCode}</span>
                              </div>
                            </div>
                          </th>
                        </tr>
                      ))}
                  </tbody>
                </table>
                <div className="mt-3 d-flex justify-content-end">
                  <Pagination
                    activePage={current_page}
                    itemsCountPerPage={per_page}
                    totalItemsCount={total}
                    onChange={(page) => fetchAllUsers(page)}
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

export default withRouter(UserTable);
