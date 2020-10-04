export const DONOR_TYPES = { ALL: 'All', NORMAL: 'Normal', CORPORATE: 'Corporate' };

export const isValidFilterType = (typeFilter) => {
  return Object.values(DONOR_TYPES).includes(typeFilter);
};

export const ACTIONS = {
  MAKE_CORPORATE: 'makeCorporate',
  REVOKE_CORPORATE: 'revokeCorporate',
  BAN: 'ban',
};
