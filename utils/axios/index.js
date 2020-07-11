import axios from 'axios';
import { BASE_URL, CLOUD_FUNCTIONS_URL } from '../constants/siteUrl';

const headers = { Accept: 'application/json', 'Access-Control-Allow-Origin': '*' };
const params = { format: 'json' };

const client = axios.create({
  baseURL: BASE_URL,
  timeout: 20000,
  withCredentials: true,
  headers,
  params,
});

const cloudFunctionClient = axios.create({
  baseURL: CLOUD_FUNCTIONS_URL,
  withCredentials: false,
  headers
})

export { client, cloudFunctionClient };
