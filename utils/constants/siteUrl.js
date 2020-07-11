let BASE_URL = '';
let FIREBASE_EMAIL_ACTION_URL = '';

if (process.env.NODE_ENV === 'development') {
  BASE_URL = 'http://localhost:3001';
  FIREBASE_EMAIL_ACTION_URL = 'http://localhost:3001';
} else {
  BASE_URL = 'https://admin-gfg.herokuapp.com/';
  FIREBASE_EMAIL_ACTION_URL = 'https://admin-gfg.herokuapp.com/';
}

export { BASE_URL, FIREBASE_EMAIL_ACTION_URL };
