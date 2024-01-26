import React, { useCallback, useEffect, useState } from 'react';
import * as yup from 'yup';
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { Link, useHistory } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { getUserFullName } from 'services/userServices';
import { success, error as errorToast } from 'utils/toast';
import { DAILY_HEALTH_DECLARATION } from 'constants/routes';
import { dhdById, dhdCreate, formatCreateDhdInput } from 'services/dhdServices';
import {
  DHD_AGREE,
  DHD_CHECK_DATE,
  DHD_DATE,
  DHD_DOCTOR_NAME,
  DHD_HOSPITAL_NAME,
  DHD_OTHER_SYMPTOM,
  DHD_OUTSIDE_LOCATION,
  DHD_REQUIRED_RADIO,
  DHD_REQUIRED_SYMPTOM,
  DHD_SYMPTOM_REPORT,
  DHD_TEST_AND_RESULTS
} from 'constants/appConstant';

const applySchema = yup.object().shape({
  declarationDate: yup
    .date()
    .min(new Date().toLocaleDateString(), DHD_CHECK_DATE)
    .required(DHD_DATE)
    .typeError(DHD_DATE),
  feeling: yup.string().required(DHD_REQUIRED_RADIO),
  isFamilyUnwell: yup.string().when('feeling', {
    is: 'fitAndFine',
    then: yup.string().required(DHD_REQUIRED_RADIO)
  }),
  matchedCovid: yup.string().when('isFamilyUnwell', {
    is: 'yes',
    then: yup.string().required(DHD_REQUIRED_RADIO)
  }),
  reportDate: yup.date().when('matchedCovid', {
    is: 'yes',
    then: yup.date().required(DHD_SYMPTOM_REPORT)
  }),
  symptoms: yup.array().when('feeling', {
    is: 'unwell',
    then: yup.array().min(1, DHD_REQUIRED_SYMPTOM)
  }),
  otherSymptom: yup.string().when('symptoms', {
    is: (symptoms) => symptoms?.includes('others'),
    then: yup.string().required(DHD_OTHER_SYMPTOM)
  }),
  hasConsultedDoctor: yup.string().when('symptoms', {
    is: (symptoms) => symptoms?.length >= 1,
    then: yup.string().required(DHD_REQUIRED_RADIO)
  }),
  doctorName: yup.string().when('hasConsultedDoctor', {
    is: 'yes',
    then: yup.string().required(DHD_DOCTOR_NAME)
  }),
  hospitalName: yup.string().when('hasConsultedDoctor', {
    is: 'yes',
    then: yup.string().required(DHD_HOSPITAL_NAME)
  }),
  testAndResult: yup.string().when('hasConsultedDoctor', {
    is: 'yes',
    then: yup.string().required(DHD_TEST_AND_RESULTS)
  }),
  pcrOrAntigen: yup.string().when('hasConsultedDoctor', {
    is: 'yes',
    then: yup.string().required(DHD_REQUIRED_RADIO)
  }),
  pcrTest: yup.string().when('pcrOrAntigen', {
    is: 'yes',
    then: yup.string().required(DHD_REQUIRED_RADIO)
  }),
  antigenTest: yup.string().when('pcrOrAntigen', {
    is: 'yes',
    then: yup.string().required(DHD_REQUIRED_RADIO)
  }),
  goneOutside: yup.string().required(DHD_REQUIRED_RADIO),
  outsideLocation: yup.string().when('goneOutside', {
    is: 'yes',
    then: yup.string().required(DHD_OUTSIDE_LOCATION)
  }),
  metCoworker: yup.string().required(DHD_REQUIRED_RADIO),
  agree: yup.boolean().oneOf([true], DHD_AGREE)
});

const DailyHealthDeclarationNew = (props) => {
  const history = useHistory();

  const onSubmit = async (formData) => {
    try {
      await dhdCreate(formatCreateDhdInput(formData));

      success({ message: 'Successfully submitted Daily Health Declaration report.' });
      return history.push(DAILY_HEALTH_DECLARATION);
    } catch (error) {
      const { data } = error.response;
      const messages = data?.errors && Object.values(data?.errors)?.flat();

      errorToast({ message: messages?.[0] });
    }
  };

  const { register, handleSubmit, watch, errors, reset } = useForm({
    resolver: yupResolver(applySchema),
    defaultValues: { declarationDate: new Date().toISOString().split('T')[0] }
  });

  const { id: dhdId } = props.match.params;

  const fetchDhdById = useCallback(async () => {
    const { data } = await dhdById(dhdId);
    return { ...data, ...data.details };
  }, []);

  useEffect(() => {
    if (dhdId) {
      fetchDhdById(dhdId).then((data) => {
        reset({
          ...data,
          declarationDate: new Date(data.declarationDate).toISOString().split('T')[0],
          reportDate: new Date(data.reportDate).toISOString().split('T')[0]
        });
      });
    }
  }, [dhdId]);

  const { user } = useSelector((state) => state.data.auth);

  const feeling = watch('feeling');

  const familyUnwell = watch('isFamilyUnwell');

  const matchedCovid = watch('matchedCovid');

  const symptoms = watch('symptoms');

  const consultedDoctor = watch('hasConsultedDoctor');

  const pcrOrAntigen = watch('pcrOrAntigen');

  const goneOutside = watch('goneOutside');

  return (
    <div>
      <div className="header bg-primary pb-6">
        <div className="container-fluid">
          <div className="header-body">
            <div className="row align-items-center py-4">
              <div className="col-lg-6 col-7">
                <h6 className="h2 text-white mb-5">
                  <FontAwesomeIcon icon={faHeart} className="dashboard-icon mr-2" />
                  DAILY HEALTH DECLARATION
                </h6>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container-fluid mt--6">
        <div className="row">
          <div className="card col-7 mx-auto">
            <div className="card-header row border-0">
              <div className="col-12">
                <h3 className="mb-0 text-body">Daily Health Declaration</h3>
                <h4 className="mb-0 text-body">
                  (Information submitted here shall be treated with highest privacy and sensitivity.)
                </h4>
              </div>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="row">
                  <div className="col-12">
                    <label className="form-control-label">
                      Date <span className="text-danger">*</span>
                    </label>
                    <div className="form-group">
                      <input
                        name="declarationDate"
                        className="form-control bg-custom"
                        type="date"
                        ref={register}
                        disabled={dhdId}
                      />
                      {errors.declarationDate && (
                        <p className="text-danger text-xs mt-1">* {errors.declarationDate.message}</p>
                      )}
                    </div>
                    <div className="form-group">
                      <label className="form-control-label">Name</label>
                      <input
                        disabled
                        name="name"
                        type="text"
                        className="form-control bg-custom"
                        placeholder={getUserFullName(user)}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-control-label">Employee ID</label>
                      <input
                        disabled
                        name="employee_id"
                        type="text"
                        className="form-control bg-custom"
                        placeholder={user.userCode}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-control-label">
                        How are you feeling today? <span className="text-danger">*</span>
                      </label>
                      <div>
                        <div className="custom-control custom-radio custom-control-inline">
                          <input
                            type="radio"
                            id="fitAndFine"
                            name="feeling"
                            className="custom-control-input"
                            value="fitAndFine"
                            ref={register}
                            disabled={dhdId}
                          />
                          <label className="custom-control-label" htmlFor="fitAndFine">
                            Fit and Fine
                          </label>
                        </div>
                        <div className="custom-control custom-radio custom-control-inline">
                          <input
                            type="radio"
                            id="unwell"
                            name="feeling"
                            className="custom-control-input"
                            value="unwell"
                            ref={register}
                            disabled={dhdId}
                          />
                          <label className="custom-control-label" htmlFor="unwell">
                            Unwell
                          </label>
                        </div>
                        {errors.feeling && <p className="text-danger text-xs mt-1">* {errors.feeling.message}</p>}
                      </div>
                    </div>
                    {feeling === 'fitAndFine' && (
                      <div className="form-group">
                        <label className="form-control-label">
                          Do you have any members in your family / whom you stay with, who are unwell / sick?{' '}
                          <span className="text-danger">*</span>
                        </label>
                        <div>
                          <div className="custom-control custom-radio custom-control-inline">
                            <input
                              type="radio"
                              id="familyUnwellYes"
                              name="isFamilyUnwell"
                              className="custom-control-input"
                              value="yes"
                              ref={register}
                              disabled={dhdId}
                            />
                            <label className="custom-control-label" htmlFor="familyUnwellYes">
                              Yes
                            </label>
                          </div>
                          <div className="custom-control custom-radio custom-control-inline">
                            <input
                              type="radio"
                              id="familyUnwellNo"
                              name="isFamilyUnwell"
                              className="custom-control-input"
                              value="no"
                              ref={register}
                              disabled={dhdId}
                            />
                            <label className="custom-control-label" htmlFor="familyUnwellNo">
                              No
                            </label>
                          </div>
                          {errors.isFamilyUnwell && (
                            <p className="text-danger text-xs mt-1">* {errors.isFamilyUnwell.message}</p>
                          )}
                        </div>
                      </div>
                    )}
                    {familyUnwell === 'yes' && (
                      <div className="form-group">
                        <label className="form-control-label">
                          Does the sickness matches to or is COVID-19 Positive? <span className="text-danger">*</span>
                        </label>
                        <div>
                          <div className="custom-control custom-radio custom-control-inline">
                            <input
                              type="radio"
                              id="matchedCovidYes"
                              name="matchedCovid"
                              className="custom-control-input"
                              value="yes"
                              ref={register}
                              disabled={dhdId}
                            />
                            <label className="custom-control-label" htmlFor="matchedCovidYes">
                              Yes
                            </label>
                          </div>
                          <div className="custom-control custom-radio custom-control-inline">
                            <input
                              type="radio"
                              id="matchedCovidNo"
                              name="matchedCovid"
                              className="custom-control-input"
                              value="no"
                              ref={register}
                              disabled={dhdId}
                            />
                            <label className="custom-control-label" htmlFor="matchedCovidNo">
                              No
                            </label>
                          </div>
                        </div>
                        {errors.matchedCovid && (
                          <p className="text-danger text-xs mt-1">* {errors.matchedCovid.message}</p>
                        )}
                      </div>
                    )}
                    {matchedCovid === 'yes' && (
                      <div className="form-group">
                        <label className="form-control-label">
                          When was the first symptom seen or the COVID-19 Positive report received?{' '}
                          <span className="text-danger">*</span>
                        </label>
                        <input
                          name="reportDate"
                          className="form-control bg-custom"
                          type="date"
                          ref={register}
                          disabled={dhdId}
                        />
                        {errors.reportDate && <p className="text-danger text-xs mt-1">* {errors.reportDate.message}</p>}
                      </div>
                    )}
                    {feeling === 'unwell' && (
                      <div className="form-group">
                        <label className="form-control-label">
                          Select the symptoms. <span className="text-danger">*</span>
                        </label>
                        <div className="custom-control custom-checkbox">
                          <input
                            type="checkbox"
                            className="custom-control-input"
                            name="symptoms"
                            id="fever"
                            value="fever"
                            ref={register}
                            disabled={dhdId}
                          />
                          <label className="custom-control-label" htmlFor="fever">
                            Fever
                          </label>
                        </div>
                        <div className="custom-control custom-checkbox">
                          <input
                            type="checkbox"
                            className="custom-control-input"
                            name="symptoms"
                            id="commonCold"
                            value="commonCold"
                            ref={register}
                            disabled={dhdId}
                          />
                          <label className="custom-control-label" htmlFor="commonCold">
                            Common-Cold
                          </label>
                        </div>
                        <div className="custom-control custom-checkbox">
                          <input
                            type="checkbox"
                            className="custom-control-input"
                            name="symptoms"
                            id="headache"
                            value="headache"
                            ref={register}
                            disabled={dhdId}
                          />
                          <label className="custom-control-label" htmlFor="headache">
                            Headache
                          </label>
                        </div>
                        <div className="custom-control custom-checkbox">
                          <input
                            type="checkbox"
                            className="custom-control-input"
                            name="symptoms"
                            id="bodyache"
                            value="bodyache"
                            ref={register}
                            disabled={dhdId}
                          />
                          <label className="custom-control-label" htmlFor="bodyache">
                            Body-Ache
                          </label>
                        </div>
                        <div className="custom-control custom-checkbox">
                          <input
                            type="checkbox"
                            className="custom-control-input"
                            name="symptoms"
                            id="copd"
                            value="copd"
                            ref={register}
                            disabled={dhdId}
                          />
                          <label className="custom-control-label" htmlFor="copd">
                            COPD / Shortness of Breathing
                          </label>
                        </div>
                        <div className="custom-control custom-checkbox">
                          <input
                            type="checkbox"
                            className="custom-control-input"
                            name="symptoms"
                            id="others"
                            value="others"
                            ref={register}
                            disabled={dhdId}
                          />
                          <label className="custom-control-label" htmlFor="others">
                            Others
                          </label>
                        </div>
                        {errors.symptoms && <p className="text-danger text-xs mt-1">* {errors.symptoms.message}</p>}
                      </div>
                    )}
                    {symptoms &&
                      symptoms.length !== 0 &&
                      symptoms.map(
                        (value) =>
                          value === 'others' && (
                            <div className="form-group">
                              <label className="form-control-label">
                                Mention other symptoms <span className="text-danger">*</span>
                              </label>
                              <textarea
                                name="otherSymptom"
                                rows="3"
                                className="form-control"
                                ref={register}
                                disabled={dhdId}
                              />
                              {errors.otherSymptom && (
                                <p className="text-danger text-xs mt-1">* {errors.otherSymptom.message}</p>
                              )}
                            </div>
                          )
                      )}
                    {symptoms && symptoms.length !== 0 && (
                      <div className="form-group">
                        <label className="form-control-label">
                          Have you consulted Doctor? <span className="text-danger">*</span>
                        </label>
                        <div>
                          <div className="custom-control custom-radio custom-control-inline">
                            <input
                              type="radio"
                              id="consultedYes"
                              name="hasConsultedDoctor"
                              className="custom-control-input"
                              value="yes"
                              ref={register}
                              disabled={dhdId}
                            />
                            <label className="custom-control-label" htmlFor="consultedYes">
                              Yes
                            </label>
                          </div>
                          <div className="custom-control custom-radio custom-control-inline">
                            <input
                              type="radio"
                              id="consultedNo"
                              name="hasConsultedDoctor"
                              className="custom-control-input"
                              value="no"
                              ref={register}
                              disabled={dhdId}
                            />
                            <label className="custom-control-label" htmlFor="consultedNo">
                              No
                            </label>
                          </div>
                          {errors.hasConsultedDoctor && (
                            <p className="text-danger text-xs mt-1">* {errors.hasConsultedDoctor.message}</p>
                          )}
                        </div>
                      </div>
                    )}
                    {consultedDoctor === 'yes' && (
                      <div className="row">
                        <div className="col-lg-6">
                          <div className="form-group">
                            <label className="form-control-label">
                              Doctor's Name <span className="text-danger">*</span>
                            </label>
                            <input
                              name="doctorName"
                              type="text"
                              className="form-control"
                              ref={register}
                              disabled={dhdId}
                            />
                            {errors.doctorName && (
                              <p className="text-danger text-xs mt-1">* {errors.doctorName.message}</p>
                            )}
                          </div>
                        </div>
                        <div className="col-lg-6">
                          <div className="form-group">
                            <label className="form-control-label">
                              Hospital's Name <span className="text-danger">*</span>
                            </label>
                            <input
                              name="hospitalName"
                              type="text"
                              className="form-control"
                              ref={register}
                              disabled={dhdId}
                            />
                            {errors.hospitalName && (
                              <p className="text-danger text-xs mt-1">* {errors.hospitalName.message}</p>
                            )}
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="form-group">
                            <label className="form-control-label">
                              Tests Performed and Results <span className="text-danger">*</span>
                            </label>
                            <textarea
                              name="testAndResult"
                              rows="3"
                              className="form-control"
                              ref={register}
                              disabled={dhdId}
                            />
                            {errors.testAndResult && (
                              <p className="text-danger text-xs mt-1">* {errors.testAndResult.message}</p>
                            )}
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="form-group">
                            <label className="form-control-label">
                              Have you done (or received report of) rt-PCR test or Antigen Test in last 24 hours?{' '}
                              <span className="text-danger">*</span>
                            </label>
                            <div>
                              <div className="custom-control custom-radio custom-control-inline">
                                <input
                                  type="radio"
                                  id="pcrOrAntigenYes"
                                  name="pcrOrAntigen"
                                  className="custom-control-input"
                                  value="yes"
                                  ref={register}
                                  disabled={dhdId}
                                />
                                <label className="custom-control-label" htmlFor="pcrOrAntigenYes">
                                  Yes
                                </label>
                              </div>
                              <div className="custom-control custom-radio custom-control-inline">
                                <input
                                  type="radio"
                                  id="pcrOrAntigenNo"
                                  name="pcrOrAntigen"
                                  className="custom-control-input"
                                  value="no"
                                  ref={register}
                                  disabled={dhdId}
                                />
                                <label className="custom-control-label" htmlFor="pcrOrAntigenNo">
                                  No
                                </label>
                              </div>
                              {errors.pcrOrAntigen && (
                                <p className="text-danger text-xs mt-1">* {errors.pcrOrAntigen.message}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    {pcrOrAntigen === 'yes' && (
                      <div className="form-group">
                        <label className="form-control-label">
                          What was the report? <span className="text-danger">*</span>
                        </label>
                        <div className="row">
                          <div className="col-lg-6">
                            <div className="custom-control custom-radio custom-control-inline">
                              <input
                                type="radio"
                                id="pcrPositive"
                                name="pcrTest"
                                className="custom-control-input"
                                value="positive"
                                ref={register}
                                disabled={dhdId}
                              />
                              <label className="custom-control-label" htmlFor="pcrPositive">
                                Positive rt-PCR for COVID-19
                              </label>
                            </div>
                            <div className="custom-control custom-radio custom-control-inline">
                              <input
                                type="radio"
                                id="pcrNegative"
                                name="pcrTest"
                                className="custom-control-input"
                                value="negative"
                                ref={register}
                                disabled={dhdId}
                              />
                              <label className="custom-control-label" htmlFor="pcrNegative">
                                Negative rt-PCR for COVID-19
                              </label>
                            </div>
                            {errors.pcrTest && <p className="text-danger text-xs mt-1">* {errors.pcrTest.message}</p>}
                          </div>
                          <div className="col-lg-6">
                            <div className="custom-control custom-radio custom-control-inline">
                              <input
                                type="radio"
                                id="antigenPositive"
                                name="antigenTest"
                                className="custom-control-input"
                                value="positive"
                                ref={register}
                                disabled={dhdId}
                              />
                              <label className="custom-control-label" htmlFor="antigenPositive">
                                Positive Antigen Test for COVID-19
                              </label>
                            </div>
                            <div className="custom-control custom-radio custom-control-inline">
                              <input
                                type="radio"
                                id="antigenNegative"
                                name="antigenTest"
                                className="custom-control-input"
                                value="negative"
                                ref={register}
                                disabled={dhdId}
                              />
                              <label className="custom-control-label" htmlFor="antigenNegative">
                                Negative Antigen Test for COVID-19
                              </label>
                            </div>
                            {errors.antigenTest && (
                              <p className="text-danger text-xs mt-1">* {errors.antigenTest.message}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="form-group">
                      <label className="form-control-label">
                        Have you gone outside your home / living area from the time last Health declaration was filled?{' '}
                        <span className="text-danger">*</span>
                      </label>
                      <div>
                        <div className="custom-control custom-radio custom-control-inline">
                          <input
                            type="radio"
                            id="goneOutsideYes"
                            name="goneOutside"
                            className="custom-control-input"
                            value="yes"
                            ref={register}
                            disabled={dhdId}
                          />
                          <label className="custom-control-label" htmlFor="goneOutsideYes">
                            Yes
                          </label>
                        </div>
                        <div className="custom-control custom-radio custom-control-inline">
                          <input
                            type="radio"
                            id="goneOutsideNo"
                            name="goneOutside"
                            className="custom-control-input"
                            value="no"
                            ref={register}
                            disabled={dhdId}
                          />
                          <label className="custom-control-label" htmlFor="goneOutsideNo">
                            No
                          </label>
                        </div>
                      </div>
                      {errors.goneOutside && <p className="text-danger text-xs mt-1">* {errors.goneOutside.message}</p>}
                    </div>
                    {goneOutside === 'yes' && (
                      <div className="form-group">
                        <label className="form-control-label">
                          Mention the place. <span className="text-danger">*</span>
                        </label>
                        <input
                          name="outsideLocation"
                          type="text"
                          className="form-control"
                          ref={register}
                          disabled={dhdId}
                        />
                        {errors.outsideLocation && (
                          <p className="text-danger text-xs mt-1">* {errors.outsideLocation.message}</p>
                        )}
                      </div>
                    )}
                    <div className="form-group">
                      <label className="form-control-label">
                        Have you met any of your co-workers from the time last Health declaration was filled?{' '}
                        <span className="text-danger">*</span>
                      </label>
                      <div>
                        <div className="custom-control custom-radio custom-control-inline">
                          <input
                            type="radio"
                            id="metCoworkerYes"
                            name="metCoworker"
                            className="custom-control-input"
                            value="yes"
                            ref={register}
                            disabled={dhdId}
                          />
                          <label className="custom-control-label" htmlFor="metCoworkerYes">
                            Yes
                          </label>
                        </div>
                        <div className="custom-control custom-radio custom-control-inline">
                          <input
                            type="radio"
                            id="metCoworkerNo"
                            name="metCoworker"
                            className="custom-control-input"
                            value="no"
                            ref={register}
                            disabled={dhdId}
                          />
                          <label className="custom-control-label" htmlFor="metCoworkerNo">
                            No
                          </label>
                        </div>
                      </div>
                      {errors.metCoworker && <p className="text-danger text-xs mt-1">* {errors.metCoworker.message}</p>}
                    </div>
                    <div className="form-group">
                      <label className="form-control-label">Anything you would want to add more?</label>
                      <textarea
                        name="additionalInfo"
                        rows="3"
                        className="form-control"
                        ref={register}
                        disabled={dhdId}
                      />
                      {errors.additionalInfo && (
                        <p className="text-danger text-xs mt-1">* {errors.additionalInfo.message}</p>
                      )}
                    </div>
                    <div className="form-group">
                      <div className="custom-control custom-checkbox">
                        <input
                          type="checkbox"
                          className="custom-control-input"
                          name="agree"
                          id="agreed"
                          value="true"
                          ref={register}
                          disabled={dhdId}
                        />
                        <label className="custom-control-label dhd-i-agree" htmlFor="agreed">
                          I hereby agree and confirm that the health information submitted is true and correct. I
                          understand that submitting wrong information shall mean the breach of Company's HR policy
                          including health and safety policy of the company. I shall be fully responsible for any
                          consequences including but not limited to losses or damage caused if/ due to the information
                          submitted here being wrong. I acknowledge and understand that company may take any action
                          against me, if the information submitted here is found to be wrong, misleading or falsifying
                          at any point of time.
                        </label>
                      </div>
                      {errors.agree && <p className="text-danger text-xs mt-1">* {errors.agree.message}</p>}
                    </div>
                  </div>
                </div>
                {!dhdId && (
                  <div className="text-right mt-2">
                    <button type="submit" className="btn btn-sm btn-primary btn-custom-size">
                      Submit
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyHealthDeclarationNew;
