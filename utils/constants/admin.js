export const FILTER = {
  ALL: 'all',
  CREATED_ADMIN: 'createdBy.adminId'
};

export const isValidFilter = (filter) => {
  return Object.values(FILTER).includes(filter);
};

export const ORDER_BY = {
  NAME: 'name',
  JOIN_DATE: 'joinedDateTime',
  LAST_LOGIN_DATE: 'lastLoggedInDateTime',
  CREATED_ADMIN_NAME: 'createdBy.adminName'
};

export const isValidOrderBy = (orderBy) => {
  return Object.values(ORDER_BY).includes(orderBy);
};
