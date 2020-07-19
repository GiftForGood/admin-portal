export const STATUS = {
  PENDING: 'pending',
  REVIEWING: 'reviewing',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
  RESUBMISSION: 'resubmission',
};

export const isValidStatus = (status) => {
  return Object.values(STATUS).includes(status);
};

export const STATUS_FILTER_TYPE = {
  ALL: 'all',
  ...STATUS,
};

export const isValidStatusFilterType = (statusFilter) => {
  return Object.values(STATUS_FILTER_TYPE).includes(statusFilter);
};

export const ORDER_BY = {
  ORGANIZATION: 'organization.name',
  APPLIED_DATE: 'appliedDateTime',
  LAST_UPDATED_DATE: 'lastUpdatedDateTime',
};

export const isValidOrderBy = (orderBy) => {
  return Object.values(ORDER_BY).includes(orderBy);
};

export const ACTIONS = {
  LOCK: 'lock',
  UNLOCK: 'unlock',
  ACCEPT: 'accept',
  REJECT: 'reject',
  RESUBMIT: 'resubmit',
};
