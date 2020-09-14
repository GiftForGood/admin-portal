export const DONOR_TYPES = { ALL: 'All', NORMAL: 'Normal', CORPORATE: 'Corporate' };

export const isValidFilterType = (typeFilter) => {
  return Object.values(DONOR_TYPES).includes(typeFilter);
};
