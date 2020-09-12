import AuthAPI from './auth';
import AdminsAPI from './admins';
import NPOVerifications from './npoVerifications';
import NPOOrganizations from './npoOrganizations';
import LegalAPI from './legal';

class API {
  auth = new AuthAPI();
  admins = new AdminsAPI();
  npoVerifications = new NPOVerifications();
  npoOrganizations = new NPOOrganizations();
  legal = new LegalAPI();
}

const api = new API();

export default api;
