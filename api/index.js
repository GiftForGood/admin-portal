import AuthAPI from './auth';
import AdminsAPI from './admins';
import NPOVerifications from './npoVerifications';
import NPOOrganizations from './npoOrganizations';
import DonorsAPI from './donors';
import LegalAPI from './legal';

class API {
  auth = new AuthAPI();
  admins = new AdminsAPI();
  npoVerifications = new NPOVerifications();
  npoOrganizations = new NPOOrganizations();
  legal = new LegalAPI();
  donors = new DonorsAPI();
}

const api = new API();

export default api;
