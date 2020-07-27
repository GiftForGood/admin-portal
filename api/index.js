import AuthAPI from './auth';
import AdminsAPI from './admins';
import NPOVerifications from './npoVerifications';
import NPOOrganizations from './npoOrganizations';

class API {
  auth = new AuthAPI();
  admins = new AdminsAPI();
  npoVerifications = new NPOVerifications();
  npoOrganizations = new NPOOrganizations();
}

const api = new API();

export default api;
