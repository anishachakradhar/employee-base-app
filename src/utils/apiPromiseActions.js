const PENDING = '_PENDING';
const FULFILLED = '_FULFILLED';
const REJECTED = '_REJECTED';
const REQUESTED = '_REQUEST';

export const setPending = (base) => {
  return base + PENDING;
};

export const setFulfilled = (base) => {
  return base + FULFILLED;
};

export const setRejected = (base) => {
  return base + REJECTED;
};

export const setRequested = (base) => {
  return base + REQUESTED;
};

export const createApiPromiseActions = (base) => {
  const pending = setPending(base);
  const fulfilled = setFulfilled(base);
  const rejected = setRejected(base);
  const requested = setRequested(base);
  return {
    pending,
    fulfilled,
    rejected,
    requested
  };
};
