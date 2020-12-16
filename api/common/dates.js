import * as moment from 'moment';

export const isValidDate = (dateObj) => {
  if (dateObj === null) {
    return false;
  }

  if (dateObj.day === undefined || dateObj.month === undefined || dateObj.year === undefined) {
    return false;
  }

  const date = `${dateObj.day}-${dateObj.month}-${dateObj.year}`;
  const dateMoment = moment(date, 'DD-MM-YYYY');
  if (!dateMoment.isValid()) {
    return false;
  }

  return true;
};

export const isValidDateRange = (fromDateObj, toDateObj, diff) => {
  const fromDate = `${fromDateObj.day}-${fromDateObj.month}-${fromDateObj.year}`;
  const toDate = `${toDateObj.day}-${toDateObj.month}-${toDateObj.year}`;

  const fromDateMoment = moment(fromDate, 'DD-MM-YYYY');
  const toDateMoment = moment(toDate, 'DD-MM-YYYY');

  if (toDateMoment.diff(fromDateMoment, 'days') < diff) {
    return false;
  }

  return true;
};

export const getDate = (dateObj) => {
  const date = `${dateObj.day}-${dateObj.month}-${dateObj.year}`;
  return moment(date, 'DD-MM-YYYY').toDate();
};
