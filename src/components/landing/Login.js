import React from 'react';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { yupResolver } from '@hookform/resolvers/yup';

import { loginRequest } from 'actions/authActions';
import { LOGIN_EMAIL, LOGIN_EMAIL_TYPE, LOGIN_PASSWORD } from 'constants/appConstant';
import Error from 'components/Error';
import { FullPageLoading } from 'components/loading';

const loginSchema = yup.object().shape({
  email: yup.string().email(LOGIN_EMAIL_TYPE).required(LOGIN_EMAIL),
  password: yup.string().required(LOGIN_PASSWORD)
});

const Login = () => {
  const { register, handleSubmit, errors } = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: { email: '', password: '' }
  });

  const dispatch = useDispatch();

  const { message: errorMessage } = useSelector((state) => state.data.error);
  const { isLoading } = useSelector((state) => state.ui.auth);

  const onSubmit = (formData) => {
    dispatch(loginRequest(formData));
  };

  return (
    <>
      {isLoading ? (
        <FullPageLoading />
      ) : (
        <div className="container pt-200 pb-5">
          <div className="row justify-content-center">
            <div className="col-lg-5 col-md-7">
              <div className="card bg-secondary border-0 mb-0">
                <div className="card-body px-lg-5 py-lg-5">
                  <div className="text-center text-muted mb-4">
                    <div className="medium">Sign In</div>
                  </div>
                  <form onSubmit={handleSubmit(onSubmit)}>
                    {errorMessage && <Error message={errorMessage} />}
                    <div className="form-group mb-3">
                      <div className="input-group input-group-merge input-group-alternative">
                        <div className="input-group-prepend">
                          <span className="input-group-text">
                            <i className="ni ni-email-83"></i>
                          </span>
                        </div>
                        <input name="email" className="form-control" placeholder="Email" ref={register} />
                      </div>
                      {errors.email && <p className="text-danger text-xs mt-1">* {errors.email.message}</p>}
                    </div>
                    <div className="form-group">
                      <div className="input-group input-group-merge input-group-alternative">
                        <div className="input-group-prepend">
                          <span className="input-group-text">
                            <i className="ni ni-lock-circle-open"></i>
                          </span>
                        </div>
                        <input
                          name="password"
                          className="form-control"
                          placeholder="Password"
                          type="password"
                          ref={register}
                        />
                      </div>
                      {errors.password && <p className="text-danger text-xs mt-1">* {errors.password.message}</p>}
                    </div>
                    <div className="text-center">
                      <button type="submit" className="btn btn-primary my-4">
                        Sign in
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Login;
