import * as yup from 'yup';
import { withRouter } from 'react-router';
import { Link, useHistory } from 'react-router-dom';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { faBullhorn } from '@fortawesome/free-solid-svg-icons';
import React, { useCallback, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';

import { ANNOUNCEMENTS_INDEX } from 'constants/routes';
import { success, error as errorToast } from 'utils/toast';
import { SingleDatePicker } from 'components/common/DateTimePicker';
import {
  announcementCreate,
  fetchAnnouncementBySlug,
  formatCreateAnnouncementInput,
  updateAnnouncement
} from 'services/announcementServices';
import {
  ANNOUNCEMENT_DATE_TYPE,
  ANNOUNCEMENT_END_AFTER_START,
  ANNOUNCEMENT_END_DATE,
  ANNOUNCEMENT_START_AFTER_TODAY,
  ANNOUNCEMENT_START_DATE,
  ANNOUNCEMENT_TITLE
} from 'constants/appConstant';

const applySchema = () =>
  yup.object().shape({
    startDate: yup
      .date()
      .required(ANNOUNCEMENT_DATE_TYPE)
      .typeError(ANNOUNCEMENT_START_DATE)
      .min(new Date().toLocaleDateString(), ANNOUNCEMENT_START_AFTER_TODAY),
    endDate: yup
      .date()
      .required(ANNOUNCEMENT_DATE_TYPE)
      .typeError(ANNOUNCEMENT_END_DATE)
      .min(yup.ref('startDate'), ANNOUNCEMENT_END_AFTER_START),
    title: yup.string().required(ANNOUNCEMENT_TITLE)
  });

const AnnouncementCreate = (props) => {
  const { slug: selectedAnnouncementSlug } = props.match.params;
  const [announcement, setAnnouncement] = useState([]);
  const [description, setDescription] = useState();

  const isCreate = Boolean(!selectedAnnouncementSlug);

  const { register, handleSubmit, errors, control, reset } = useForm({
    resolver: yupResolver(applySchema()),
    defaultValues: {
      startDate: '',
      endDate: '',
      title: '',
      description: ''
    }
  });

  const history = useHistory();

  const onSubmit = useCallback(async (formData) => {
    const formDataWithDescription = { ...formData, description };
    try {
      isCreate
        ? await announcementCreate(formatCreateAnnouncementInput(formDataWithDescription))
        : await updateAnnouncement(announcement.id, formDataWithDescription);

      success({ message: 'Announcement' + (isCreate ? ' created ' : ' updated ') + 'successfully.' });

      handleBack();
    } catch (error) {
      const { data } = error.response;
      const messages = data?.errors && Object.values(data?.errors)?.flat();

      errorToast({ message: messages?.[0] });
    }
  });

  const fetchAnnouncement = useCallback(async (selectedAnnouncementSlug) => {
    try {
      const { data } = await fetchAnnouncementBySlug(selectedAnnouncementSlug);
      setAnnouncement(data);
      setDescription(data.description || '');

      reset({
        ...data,
        startDate: data.start_date,
        endDate: data.end_date
      });
    } catch (error) {
      return history.push(ANNOUNCEMENTS_INDEX);
    }
  }, []);

  useEffect(() => {
    selectedAnnouncementSlug && fetchAnnouncement(selectedAnnouncementSlug);
  }, [fetchAnnouncement, selectedAnnouncementSlug]);

  const handleBack = () => {
    return history.length > 1 ? history.goBack() : history.push(ANNOUNCEMENTS_INDEX);
  };

  const handleDescriptionChange = (event, editor) => {
    const data = editor.getData();
    setDescription(data);
  };

  return (
    <div>
      <div className="header bg-primary pb-6">
        <div className="container-fluid">
          <div className="header-body">
            <div className="row align-items-center py-4">
              <div className="col-lg-6 col-7">
                <h6 className="h2 text-white mb-5">
                  <FontAwesomeIcon icon={faBullhorn} className="dashboard-icon mr-2" />
                  Announcements
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
                    <h3 className="mb-0 text-body">Add Announcement</h3>
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
                                    placeholder="Start date of the announcement"
                                    onChange={(date) => field.onChange(date?.format('YYYY-MM-DD'))}
                                  />
                                );
                              }}
                              name="startDate"
                              control={control}
                            />
                            {errors.startDate && (
                              <p className="text-danger text-xs mt-1">* {errors.startDate.message}</p>
                            )}
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
                                    placeholder="End date of the announcement"
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
                      <div className="col-lg-12">
                        <div className="form-group">
                          <label className="form-control-label">
                            Title <span className="text-danger">*</span>
                          </label>
                          <input
                            name="title"
                            className="form-control"
                            placeholder="Title of the announcement"
                            ref={register}
                          />
                          {errors.title && <p className="text-danger text-xs mt-1">* {errors.title.message}</p>}
                        </div>
                      </div>
                      <div className="col-lg-12">
                        <div className="form-group">
                          <label className="form-control-label">Description</label>
                          <div className="ck-editor">
                            <CKEditor
                              editor={DecoupledEditor}
                              data={description}
                              onReady={(editor) => {
                                editor.ui.getEditableElement().parentElement.append(editor.ui.view.toolbar.element);
                              }}
                              onChange={handleDescriptionChange}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <button type="submit" className="btn btn-sm btn-primary btn-custom-size">
                        {isCreate ? 'Submit' : 'Update'}
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

export default withRouter(AnnouncementCreate);
