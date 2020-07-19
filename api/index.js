import AuthAPI from './auth';
import AdminsAPI from './admins';
import NPOVerifications from './npoVerifications';

class API {
  auth = new AuthAPI();
  admins = new AdminsAPI();
  npoVerifications = new NPOVerifications();
}

const api = new API();

export default api;
