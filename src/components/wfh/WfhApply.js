import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { Link, useHistory } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch, useSelector } from 'react-redux';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import React, { useCallback, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { WFH } from 'constants/routes';
import { setError } from 'actions/errorActions';
import { getUserFullName } from 'services/userServices';
import { success, error as errorToast } from 'utils/toast';
import { fetchWfhById, sendWfhReport } from 'services/wfhServices';
import { wfhApply, formatApplyWfhInput } from 'services/wfhServices';
import { WFH_DATE, WFH_CHECK_DATE, WFH_REASON, WFH_WORK_TODOS, WFH_STATUS } from 'constants/appConstant';

const applySchema = yup.object().shape({
  attendanceDate: yup
    .date()
    .min(new Date().toLocaleDateString(), WFH_CHECK_DATE)
    .required(WFH_DATE)
    .typeError(WFH_DATE),
  reason: yup.string().required(WFH_REASON),
  todo: yup.string().required(WFH_WORK_TODOS)
});

const WfhApply = (props) => {
  const { id: selectedWfhId } = props.match.params;
  const [selectedWfh, setSelectedWfh] = useState(null);
  const [canSubmit, setCanSubmit] = useState(false);

  const isApply = Boolean(!selectedWfhId);

  const { register, handleSubmit, errors, reset } = useForm({
    resolver: yupResolver(applySchema),
    defaultValues: {
      attendanceDate: new Date().toISOString().split('T')[0],
      reason: 'COVID-19',
      todo: '',
      blocker: ''
    }
  });

  const dispatch = useDispatch();
  const history = useHistory();
  const { user } = useSelector((state) => state.data.auth);

  const getWfhById = useCallback(
    async (id) => {
      try {
        const { data } = await fetchWfhById(id);

        setSelectedWfh(data);

        reset(data);
      } catch (error) {
        return history.push(WFH);
      }
    },
    [reset, history]
  );

  useEffect(() => {
    selectedWfhId && getWfhById(selectedWfhId);
  }, [getWfhById, selectedWfhId]);

  useEffect(() => {
    setCanSubmit(selectedWfh && selectedWfh.status === 'REQUEST_APPROVED' && selectedWfh.user.id === user.id);
  }, [selectedWfh, user]);

  const onSubmit = useCallback(async (formData) => {
    try {
      isApply ? await wfhApply(formatApplyWfhInput(formData)) : await sendWfhReport(selectedWfhId, formData);

      success({ message: 'WFH request successful. ' });

      return history.push(WFH);
    } catch (error) {
      const { data } = error.response;
      const messages = data?.errors && Object.values(data?.errors)?.flat();

      errorToast({ message: messages?.[0] });

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
                    <h3 className="mb-0 text-body">Apply for Work from Home</h3>
                  </div>
                  <div className="col-6 text-right">
                    <Link to={{ pathname: WFH }} className="btn btn-sm btn-outline-primary">
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
                        <label className="form-control-label">
                          Date <span className="text-danger">*</span>
                        </label>
                        <div className="form-group">
                          <input
                            name="attendanceDate"
                            className="form-control bg-custom"
                            type="date"
                            ref={register}
                            readOnly={selectedWfhId}
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
                            placeholder={selectedWfh ? getUserFullName(selectedWfh.user) : getUserFullName(user)}
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-control-label">Employee ID</label>
                          <input
                            disabled
                            name="employee_id"
                            type="text"
                            className="form-control bg-custom"
                            placeholder={selectedWfh ? selectedWfh.user.userCode : user.userCode}
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
                            placeholder="Enter your reason for WFH."
                            ref={register}
                            readOnly={selectedWfhId}
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
                            readOnly={selectedWfhId}
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
                            readOnly={selectedWfhId}
                          />
                        </div>
                      </div>
                    </div>

                    {selectedWfhId && (
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
                              readOnly={selectedWfh && WFH_STATUS[selectedWfh.status] !== WFH_STATUS.REQUEST_APPROVED}
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
                              readOnly={selectedWfh && WFH_STATUS[selectedWfh.status] !== WFH_STATUS.REQUEST_APPROVED}
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

export default WfhApply;
