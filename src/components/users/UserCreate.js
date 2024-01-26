import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import React, { useCallback, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import http from 'utils/http';
import endpoints from 'constants/endpoints';
import { USER_INDEX } from 'constants/routes';
import { setError } from 'actions/errorActions';
import { getUserFullName } from 'services/userServices';
import { success, error as errorToast } from 'utils/toast';
import { POST, GET, GENDER, USER_STATUS, MARITAL_STATUS } from 'constants/appConstant';

const applySchema = yup.object().shape({
  firstName: yup.string().required('First Name is required'),
  lastName: yup.string().required('Last Name is required'),
  email: yup.string().required('Email is required'),
  password: yup.string().required('Password is required'),
  managerId: yup.string().required('Manager should be selected'),
  userCode: yup.string().required('Employee Code is required'),
  panNumber: yup.string().required('Pan number is required.').min(9, 'Pan number should be 9 digits.'),
  gender: yup.string().required('Gender is required.'),
  maritalStatus: yup.string().required('Marital status is required.'),
  status: yup.string().required('Employee status is required.')
});

const UserCreate = (props) => {
  const [users, setUsers] = useState();

  const fetchAllUsers = useCallback(async () => {
    let { data } = await http(GET, endpoints.users.all);
    let { last_page, current_page } = data.meta;
    data = data.data;

    if (last_page > current_page) {
      while (last_page > current_page) {
        let { data: nextPageData } = await http(GET, endpoints.users.all, { params: { page: current_page + 1 } });
        data = data.concat(nextPageData.data);
        current_page++;
      }
    }

    setUsers(data);
  }, []);

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const { register, handleSubmit, errors, reset } = useForm({
    resolver: yupResolver(applySchema)
  });

  const dispatch = useDispatch();
  const history = useHistory();

  const onSubmit = useCallback(async (formData) => {
    try {
      http(POST, endpoints.users.all, {
        body: {
          ...formData
        }
      });

      success({ message: 'Employee created.' });

      return history.push(USER_INDEX);
    } catch (error) {
      const { data } = error.response;
      errorToast({ message: data.message });

      dispatch(setError(data));
    }
  });

  return (
    <div>
      <div className="header bg-primary pb-6">
        <div className="container-fluid">
          <div className="header-body">
            <div className="row align-items-center py-4">
              <div className="col-lg-6 col-7">
                <h6 className="h2 text-white mb-5">
                  <FontAwesomeIcon icon={faHome} className="dashboard-icon mr-2" />
                  WORK FROM HOME
                </h6>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container-fluid mt--6">
        <div className="row">
          <div className="col-xl-1 order-xl-1"></div>
          <div className="col-xl-10 order-xl-1">
            <div className="card">
              <div className="card-header">
                <div className="row align-items-center">
                  <div className="col-6">
                    <h3 className="mb-0 text-body">Add Employee</h3>
                  </div>
                  <div className="col-6 text-right">
                    <Link to={{ pathname: USER_INDEX }} className="btn btn-sm btn-outline-primary">
                      Back
                    </Link>
                  </div>
                </div>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="pl-lg-4">
                    <div className="row">
                      <div className="col-lg-6">
                        <div className="form-group">
                          <label className="form-control-label">
                            First Name <span className="text-danger">*</span>
                          </label>
                          <input name="firstName" className="form-control" ref={register} />
                          {errors.firsName && <p className="text-danger text-xs mt-1">* {errors.firsName.message}</p>}
                        </div>
                        <div className="form-group">
                          <label className="form-control-label">Last Name</label>
                          <input name="lastName" type="text" className="form-control" ref={register} />
                          {errors.lastName && <p className="text-danger text-xs mt-1">* {errors.lastName.message}</p>}
                        </div>
                        <div className="form-group">
                          <label className="form-control-label">Email</label>
                          <input ref={register} name="email" type="text" className="form-control" />
                        </div>
                        <div className="form-group">
                          <label className="form-control-label">
                            Password <span className="text-danger">*</span>
                          </label>
                          <input name="password" type="password" className="form-control" ref={register} />
                          {errors.password && <p className="text-danger text-xs mt-1">* {errors.password.message}</p>}
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div className="form-group">
                          <label className="form-control-label">
                            User Code <span className="text-danger">*</span>
                          </label>
                          <input name="userCode" className="form-control" ref={register} />
                          {errors.userCode && <p className="text-danger text-xs mt-1">* {errors.userCode.message}</p>}
                        </div>
                        <div className="form-group">
                          <label className="form-control-label">
                            Manager <span className="text-danger">*</span>
                          </label>
                          <select name="managerId" className="form-control" ref={register}>
                            {users &&
                              users.map((user, index) => (
                                <option value={user.id} key={index}>
                                  {getUserFullName(user)}
                                </option>
                              ))}
                          </select>
                          {errors.managerId && <p className="text-danger text-xs mt-1">* {errors.managerId.message}</p>}
                        </div>
                        <div className="form-group">
                          <label className="form-control-label">
                            Pan Number <span className="text-danger">*</span>
                          </label>
                          <input name="panNumber" type="text" className="form-control" ref={register} />
                          {errors.panNumber && <p className="text-danger text-xs mt-1">* {errors.panNumber.message}</p>}
                        </div>
                        <div className="form-group">
                          <label className="form-control-label">
                            Gender <span className="text-danger">*</span>
                          </label>
                          <select name="gender" className="form-control" ref={register}>
                            {Object.keys(GENDER).map((type, index) => (
                              <option value={type} key={index}>
                                {GENDER[type]}
                              </option>
                            ))}
                          </select>
                          {errors.gender && <p className="text-danger text-xs mt-1">* {errors.gender.message}</p>}
                        </div>
                        <div className="form-group">
                          <label className="form-control-label">
                            Marital Status <span className="text-danger">*</span>
                          </label>
                          <select name="maritalStatus" className="form-control" ref={register}>
                            {Object.keys(MARITAL_STATUS).map((type, index) => (
                              <option value={type} key={index}>
                                {MARITAL_STATUS[type]}
                              </option>
                            ))}
                          </select>
                          {errors.maritalStatus && (
                            <p className="text-danger text-xs mt-1">* {errors.maritalStatus.message}</p>
                          )}
                        </div>
                        <div className="form-group">
                          <label className="form-control-label">
                            Status <span className="text-danger">*</span>
                          </label>
                          <select name="status" className="form-control" ref={register}>
                            {Object.keys(USER_STATUS).map((status, index) => (
                              <option value={status} key={index}>
                                {USER_STATUS[status]}
                              </option>
                            ))}
                          </select>
                          {errors.status && <p className="text-danger text-xs mt-1">* {errors.status.message}</p>}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <button type="submit" className="btn btn-sm btn-primary btn-custom-size">
                        Submit
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="col-xl-1 order-xl-1"></div>
        </div>
      </div>
    </div>
  );
};

export default UserCreate;
