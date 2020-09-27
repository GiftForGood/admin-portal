let BASE_URL = '';
let FIREBASE_EMAIL_ACTION_URL = '';
let CLOUD_FUNCTIONS_URL;

if (process.env.NODE_ENV === 'development') {
  BASE_URL = 'http://localhost:3001';
  FIREBASE_EMAIL_ACTION_URL = 'http://localhost:3001';
  CLOUD_FUNCTIONS_URL = 'http://localhost:5001/giftforgood/us-central1'
} else {
  BASE_URL = 'https://admin-gfg.herokuapp.com/';
  FIREBASE_EMAIL_ACTION_URL = 'https://admin-gfg.herokuapp.com/';
  CLOUD_FUNCTIONS_URL = 'https://us-central1-giftforgood.cloudfunctions.net/'
}

export { BASE_URL, FIREBASE_EMAIL_ACTION_URL, CLOUD_FUNCTIONS_URL };
