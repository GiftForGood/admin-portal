import AuthAPI from './auth';
import NPOVerifications from './npoVerifications';

class API {
  auth = new AuthAPI();
  npoVerifications = new NPOVerifications();
}

const api = new API();

export default api;
