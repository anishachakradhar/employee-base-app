import * as yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { Link, useHistory } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch, useSelector } from 'react-redux';
import { faBuilding } from '@fortawesome/free-solid-svg-icons';
import React, { useCallback, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { WFOS_INDEX } from 'constants/routes';
import { setError } from 'actions/errorActions';
import { getUserFullName } from 'services/userServices';
import { success, error as errorToast } from 'utils/toast';
import { wfoApply, formatApplyWfoInput, fetchWfoById, sendWfoReport } from 'services/wfoServices';
import { WFO_DATE, WFO_CHECK_DATE, WFO_REASON, WFO_WORK_TODOS, WFO_STATUS } from 'constants/appConstant';
import { currentDate, format } from 'utils/datetime';
import { SingleDatePicker } from 'components/common/DateTimePicker';

const applySchema = (wfo) => {
  let schema = {
    attendanceDate: yup.date().required(WFO_DATE).typeError(WFO_DATE),
    reason: yup.string().required(WFO_REASON),
    todo: yup.string().required(WFO_WORK_TODOS)
  };

  if (wfo) {
    schema = {
      ...schema,
      attendanceDate: yup
        .date()
        .test(
          'same-date',
          'Attendance Date should be same as the requested date',
          (value, context) => format(value) === wfo.attendanceDate
        ),
      done: yup
        .string()
        .when('todo', { is: (val) => Boolean(val), then: yup.string().required('Work completed is required.') })
    };
  } else {
    schema = {
      ...schema,
      attendanceDate: yup
        .date()
        .min(new Date().toLocaleDateString(), WFO_CHECK_DATE)
        .required(WFO_DATE)
        .typeError(WFO_DATE)
    };
  }

  return yup.object().shape(schema);
};

const WfoApply = (props) => {
  const { id: selectedWfoId } = props.match.params;
  const [selectedWfo, setSelectedWfo] = useState(null);
  const [canSubmit, setCanSubmit] = useState(false);

  const isApply = Boolean(!selectedWfoId);

  const { register, handleSubmit, errors, reset, getValues, control } = useForm({
    resolver: yupResolver(applySchema(selectedWfo)),
    defaultValues: {
      attendanceDate: currentDate(),
      reason: '',
      todo: '',
      blocker: ''
    }
  });

  const dispatch = useDispatch();
  const history = useHistory();
  const { user } = useSelector((state) => state.data.auth);

  const getWfoById = useCallback(
    async (id) => {
      try {
        const data = await fetchWfoById(id);

        setSelectedWfo(data);

        reset({ ...data, attendanceDate: format(data.attendanceDate) });
      } catch (error) {
        return history.push(WFOS_INDEX);
      }
    },
    [reset, history]
  );

  useEffect(() => {
    selectedWfoId && getWfoById(selectedWfoId);
  }, [getWfoById, selectedWfoId]);

  useEffect(() => {
    setCanSubmit(selectedWfo && selectedWfo.status === 'REQUEST_APPROVED' && selectedWfo.user.id === user.id);
  }, [selectedWfo, user]);

  const onSubmit = useCallback(async (formData) => {
    try {
      isApply ? await wfoApply(formatApplyWfoInput(formData)) : await sendWfoReport(selectedWfoId, formData);

      success({ message: 'WFO request successful. ' });

      return history.push(WFOS_INDEX);
    } catch (error) {
      const { data } = error.response;
      const messages = data?.errors && Object.values(data?.errors)?.flat();

      errorToast({ message: messages?.[0] });
    }
  });

  const handleBack = () => {
    history.length > 1 ? history.goBack() : history.push(WFOS_INDEX);
  };

  return (
    <div>
      <div className="header bg-primary pb-6">
        <div className="container-fluid">
          <div className="header-body">
            <div className="row align-items-center py-4">
              <div className="col-lg-6 col-7">
                <h6 className="h2 text-white mb-5">
                  <FontAwesomeIcon icon={faBuilding} className="dashboard-icon mr-2" />
                  WORK FROM OFFICE
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
                    <h3 className="mb-0 text-body">Apply for Work from Office</h3>
                  </div>
                  <div className="col-6 text-right">
                    <button onClick={handleBack} className="btn btn-sm btn-outline-primary">
                      Back
                    </button>
                  </div>
                </div>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="pl-lg-4">
                    <div className="row">
                      <div className="col-lg-6">
                        <label className="form-control-label">
                          Date <span className="text-danger">*</span>
                        </label>
                        <div className="form-group">
                          <Controller
                            render={(field) => {
                              return (
                                <SingleDatePicker
                                  value={field.value}
                                  id={field.name}
                                  placeholder="Attendance Date"
                                  onChange={(date) => field.onChange(date?.format('YYYY-MM-DD'))}
                                  disabled={Boolean(selectedWfoId)}
                                />
                              );
                            }}
                            name="attendanceDate"
                            control={control}
                          />
                          {errors.attendanceDate && (
                            <p className="text-danger text-xs mt-1">* {errors.attendanceDate.message}</p>
                          )}
                        </div>
                        <div className="form-group">
                          <label className="form-control-label">Name</label>
                          <input
                            disabled
                            name="name"
                            type="text"
                            className="form-control bg-custom"
                            placeholder={selectedWfo ? getUserFullName(selectedWfo.user) : getUserFullName(user)}
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-control-label">Employee ID</label>
                          <input
                            disabled
                            name="employee_id"
                            type="text"
                            className="form-control bg-custom"
                            placeholder={selectedWfo ? selectedWfo.user.userCode : user.userCode}
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-control-label">
                            Reason <span className="text-danger">*</span>
                          </label>
                          <input
                            name="reason"
                            type="text"
                            className="form-control"
                            placeholder="Enter your reason for WFO."
                            ref={register}
                            readOnly={selectedWfoId}
                          />
                          {errors.reason && <p className="text-danger text-xs mt-1">* {errors.reason.message}</p>}
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div className="form-group">
                          <label className="form-control-label">
                            Work for the day <span className="text-danger">*</span>
                          </label>
                          <textarea
                            name="todo"
                            rows="6"
                            className="form-control"
                            placeholder="List of tasks for the day"
                            ref={register}
                            readOnly={selectedWfoId}
                          />
                          {errors.todo && <p className="text-danger text-xs mt-1">* {errors.todo.message}</p>}
                        </div>
                        <div className="form-group">
                          <label className="form-control-label">Blockers for the work</label>
                          <textarea
                            name="blockers"
                            rows="6"
                            className="form-control"
                            placeholder="Blockers that can delay the work for the day"
                            ref={register}
                            readOnly={selectedWfoId}
                          />
                        </div>
                      </div>
                    </div>

                    {selectedWfoId && (
                      <div className="row">
                        <div className="col-lg-6">
                          <div className="form-group">
                            <label className="form-control-label">
                              Work Completed <span className="text-danger">*</span>
                            </label>
                            <textarea
                              name="done"
                              rows="6"
                              className="form-control"
                              placeholder="List of tasks completed"
                              readOnly={selectedWfo && WFO_STATUS[selectedWfo.status] !== WFO_STATUS.REQUEST_APPROVED}
                              ref={register}
                            />
                            {errors.done && <p className="text-danger text-xs mt-1">* {errors.done.message}</p>}
                          </div>
                        </div>
                        <div className="col-lg-6">
                          <div className="form-group">
                            <label className="form-control-label">Work to be Carry Forwarded</label>
                            <textarea
                              name="workForwarded"
                              rows="6"
                              className="form-control"
                              placeholder="List of tasks to be carry forwarded"
                              readOnly={selectedWfo && WFO_STATUS[selectedWfo.status] !== WFO_STATUS.REQUEST_APPROVED}
                              ref={register}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                    {(isApply || canSubmit) && (
                      <div className="text-right">
                        <button type="submit" className="btn btn-sm btn-primary btn-custom-size">
                          Submit
                        </button>
                      </div>
                    )}
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

export default WfoApply;
