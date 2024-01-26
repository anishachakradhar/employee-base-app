/**
 * Replace variable in uri
 */
export const interpolate = (url, params) => {
  if (!Array.isArray(params)) params = [params];

  return params.reduce((accumulator, currentValue) => accumulator.replace(/{.*?\}/, currentValue), url);
};
