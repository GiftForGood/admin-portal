import AuthAPI from './auth';
import AdminsAPI from './admins';

class API {
  auth = new AuthAPI();
  admins = new AdminsAPI();
}

const api = new API();

export default api;
