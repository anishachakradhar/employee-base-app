import * as yup from 'yup';
import { withRouter } from 'react-router';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { faCalendar } from '@fortawesome/free-solid-svg-icons';
import React, { useCallback, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// import http from 'utils/http';
// import endpoints from 'constants/endpoints';
// import { getUserFullName } from 'services/userServices';
import { success, error as errorToast } from 'utils/toast';
import { getAttendances } from 'services/attendanceServices';
import { SingleDatePicker } from 'components/common/DateTimePicker';
import {
  ATTENDANCE_BEFORE_TODAY,
  ATTENDANCE_DATE_TYPE,
  ATTENDANCE_EMPLOYEE,
  ATTENDANCE_END_AFTER_START,
  ATTENDANCE_END_DATE,
  ATTENDANCE_START_DATE
} from 'constants/appConstant';
import moment from 'moment';

const applySchema = () =>
  yup.object().shape({
    startDate: yup
      .date()
      .required(ATTENDANCE_DATE_TYPE)
      .typeError(ATTENDANCE_START_DATE)
      .max(new Date().toLocaleDateString(), ATTENDANCE_BEFORE_TODAY),
    endDate: yup
      .date()
      .required(ATTENDANCE_DATE_TYPE)
      .typeError(ATTENDANCE_END_DATE)
      .min(yup.ref('startDate'), ATTENDANCE_END_AFTER_START)
      .max(new Date().toLocaleDateString(), ATTENDANCE_BEFORE_TODAY)
    // employee: yup.string().required(ATTENDANCE_EMPLOYEE)
  });

const AttendanceExport = () => {
  // const [employees, setEmployees] = useState([]);
  const [attendances, setAttendances] = useState([]);

  // const fetchAllEmployees = useCallback(async () => {
  //   const { data } = await http('GET', endpoints.users.all);
  //   setEmployees(data.data);
  // }, []);

  const { register, handleSubmit, errors, control } = useForm({
    resolver: yupResolver(applySchema()),
    defaultValues: {
      startDate: '',
      endDate: ''
      // employee: ''
    }
  });

  const onSubmit = useCallback(async (formData) => {
    const date = {
      startDate: moment(formData.startDate).format('YYYY-MM-DD'),
      endDate: moment(formData.endDate).format('YYYY-MM-DD')
    };

    try {
      const data = await getAttendances(date);

      setAttendances(data);
      success({ message: 'Attendance request successful.' });
    } catch (error) {
      errorToast({ message: 'Error in attendance request.' });
    }
  });

  // useEffect(() => {
  //   fetchAllEmployees();
  // }, []);

  return (
    <div>
      <div className="header bg-primary pb-6">
        <div className="container-fluid">
          <div className="header-body">
            <div className="row align-items-center py-4">
              <div className="col-lg-6 col-7">
                <h6 className="h2 text-white mb-5">
                  <FontAwesomeIcon icon={faCalendar} className="dashboard-icon mr-2" />
                  Attendances
                </h6>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container-fluid mt--6">
        <div className="row">
          <div className="card col-12">
            <div className="card-header">
              <div className="row align-items-center">
                <div className="col-6">
                  <h3 className="mb-0 text-body">Attendance Dates</h3>
                </div>
              </div>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="pl-lg-4">
                  <div className="row">
                    {/* <div className="col-lg-12">
                        <div className="form-group">
                          <label className="form-control-label">
                            Employee <span className="text-danger">*</span>
                          </label>
                          <select className="form-control" name="employee" ref={register}>
                            <option value="">Select employee</option>
                            {employees &&
                              employees.map((employee, index) => (
                                <option value={index} key={index}>
                                  {getUserFullName(employee)}
                                </option>
                              ))}
                          </select>
                          {errors.employee && <p className="text-danger text-xs mt-1">* {errors.employee.message}</p>}
                        </div>
                      </div> */}
                    <div className="col-lg-6">
                      <div className="form-group">
                        <label className="form-control-label">
                          Start Date <span className="text-danger">*</span>
                        </label>
                        <div className="form-group">
                          <Controller
                            render={(field) => {
                              return (
                                <SingleDatePicker
                                  value={field.value}
                                  id={field.name}
                                  placeholder="Start date for the attendance"
                                  onChange={(date) => field.onChange(date?.format('YYYY-MM-DD'))}
                                />
                              );
                            }}
                            name="startDate"
                            control={control}
                          />
                          {errors.startDate && <p className="text-danger text-xs mt-1">* {errors.startDate.message}</p>}
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="form-group">
                        <label className="form-control-label">
                          End Date <span className="text-danger">*</span>
                        </label>
                        <div className="form-group">
                          <Controller
                            render={(field) => {
                              return (
                                <SingleDatePicker
                                  value={field.value}
                                  id={field.name}
                                  placeholder="End date for the attendance"
                                  onChange={(date) => field.onChange(date?.format('YYYY-MM-DD'))}
                                />
                              );
                            }}
                            name="endDate"
                            control={control}
                          />
                          {errors.endDate && <p className="text-danger text-xs mt-1">* {errors.endDate.message}</p>}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <button type="submit" className="btn btn-sm btn-primary btn-custom-size">
                      Preview
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className="container-fluid">
        <div className="row">
          <div className="card col-12">
            <div className="card-header row border-0">
              <div className="col-6">
                <h3 className="mb-0 text-body">Attendance List</h3>
              </div>
              {!!attendances.length && (
                <div className="col-6 text-right">
                  <button className="btn btn-sm btn-primary btn-custom-size">Export</button>
                </div>
              )}
            </div>
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
                      WFOs Count
                    </th>
                    <th scope="col" className="sort">
                      WFHs Count
                    </th>
                    <th scope="col" className="sort">
                      Weekends Count
                    </th>
                    <th scope="col" className="sort">
                      Missed Dates Count
                    </th>
                    <th scope="col" className="sort">
                      Missed Dates
                    </th>
                  </tr>
                </thead>
                <tbody className="list">
                  {attendances &&
                    attendances.map((attendance, index) => (
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
                              <span className="name mb-0 text-sm">{attendance.name}</span>
                            </div>
                          </div>
                        </th>
                        <td>{attendance.wfosCount}</td>
                        <td>{attendance.wfhsCount}</td>
                        <td>{attendance.weekendsCount}</td>
                        <td>{attendance.missedDatesCount}</td>
                        <td>{attendance.missedDates.join(', ')}</td>
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

export default withRouter(AttendanceExport);
