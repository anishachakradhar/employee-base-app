import moment from 'moment';

export const format = (value, format = 'YYYY-MM-DD') => {
  return moment.parseZone(value).format(format);
};

export const currentDate = (format = 'YYYY-MM-DD') => moment().format('YYYY-MM-DD');
