export const ORDER_BY = {
  NAME: 'name',
  JOIN_DATE: 'joinedDateTime',
  LAST_LOGIN_DATE: 'lastLoggedInDateTime',
  CREATED_ADMIN_NAME: 'createdBy.adminName',
};

export const isValidOrderBy = (orderBy) => {
  return Object.values(ORDER_BY).includes(orderBy);
};

export const ADMIN_ROLE = 'admin';
export const ADMIN_EDITOR_ROLE = 'adminEditor';
export const ADMIN_VERIFIER_ROLE = 'adminVerifier';
export const ROLES = [ADMIN_ROLE, ADMIN_EDITOR_ROLE, ADMIN_VERIFIER_ROLE];

export const isValidRole = (role) => {
  return ROLES.includes(role);
};
