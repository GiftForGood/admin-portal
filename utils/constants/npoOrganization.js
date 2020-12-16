export const TYPE = {
  IPC: 'IPC',
  CHARITIES: 'Charity Organisation',
  GROUND_UP: 'Ground Up',
};

export const isValidType = (type) => {
  return Object.values(TYPE).includes(type);
};

export const TYPE_FILTER_TYPE = {
  ALL: 'all',
  ...TYPE,
};

export const isValidTypeFilterType = (typeFilter) => {
  return Object.values(TYPE_FILTER_TYPE).includes(typeFilter);
};

export const SECTOR = {
  SOCIAL_AND_WELFARE: 'Social and Welfare',
  HEALTH: 'Health',
  EDUCATION: 'Education',
  COMMUNITY: 'Community',
  ARTS_AND_HERITAGE: 'Arts and Heritage',
  SPORTS: 'Sports',
  RELIGIOUS: 'Religious',
  OTHERS: 'Others',
};

export const isValidSector = (sector) => {
  return Object.values(SECTOR).includes(sector);
};

export const SECTOR_FILTER_TYPE = {
  ALL: 'all',
  ...SECTOR,
};

export const isValidSectorFilterType = (sectorFilter) => {
  return Object.values(SECTOR_FILTER_TYPE).includes(sectorFilter);
};

export const ORDER_BY = {
  NAME: 'name',
  TYPE: 'type',
  SECTOR: 'sector',
  CLASSIFICATION: 'classification',
};

export const isValidOrderBy = (orderBy) => {
  return Object.values(ORDER_BY).includes(orderBy);
};
