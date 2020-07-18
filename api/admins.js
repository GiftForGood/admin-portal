import { db, firebaseAuth } from '../utils/firebase';
import { ORDER_BY, FILTER } from '../utils/constants/admin';
import { isValidFilter, isValidOrderBy } from '../utils/constants/admin';
import { cloudFunctionClient } from '../utils/axios';
import AdminError from './error/adminError';

const administratorsCollection = db.collection('administrators');

class AdminsAPI {
  /**
   * Get all the admin infos
   * @param {string} filterType Check constants/admin.js to see all the valid filter type
   * @param {string} filter The string to filter by
   * @param {string} orderBy Check constants/admin.js to see all the valid order type
   * @param {boolean} isReverse Indicates if the query should be ordered in reverse
   * @throws {AdminError}
   * @throws {FirebaseError}
   * @return {object} A list of firebase document of all the admin infos
   */
  async getAll(filterType = FILTER.ALL, filter = '', orderBy = ORDER_BY.NAME, isReverse = true) {
    if (!isValidOrderBy(orderBy)) {
      return new AdminError('invalid-parameters', `${orderBy} is not a valid order by type. Only ${Object.values(ORDER_BY)} are valid.`); 
    }
    if (!isValidFilter(filterType)) {
      return new AdminError('invalid-parameters', `${filterType} is not a valid filter type. Only ${Object.values(FILTER)} are valid.`);
    }

    let sortOrder = 'asc';
    if (isReverse) {
      sortOrder = 'desc';
    }

    let query = administratorsCollection;
    if (filterType != FILTER.ALL) {
      query = query.where(filterType, '==', filter);
    }

    const snapshot = await query.orderBy(orderBy, sortOrder).get();
    return snapshot.docs;
  }

  /**
   * Get an admin info
   * @param {string} id 
   * @throws {FirebaseError}
   * @return {object} A firebase document of the admin info
   */
  async get(id) {
    return administratorsCollection.doc(id).get();
  }
  
  /**
   * Create a new admin from an existing account
   * @param {string} email 
   * @param {string} name 
   * @throws {AdminError}
   * @return {array} [newAdminProfile, newAdminInfo]
   */
  async createFromExistingAccount(email, name) {
    const idToken = await firebaseAuth.currentUser.getIdToken();
    const adminId = firebaseAuth.currentUser.uid;
    const data = {
      rootAdminId: adminId,
      rootAdminToken: idToken,
      email: email,
      name: name,
    };

    const res = await cloudFunctionClient.post('/registerAdminWithExistingAccount', data);
    const resData = res.data;

    if (res.status != 200) {
      throw new AuthError(resData.error.code, resData.error.message);
    }
    if (resData.error.code !== 'admin-register/success') {
      throw new AuthError(resData.error.code, resData.error.message);
    }

    return [resData.data.profile, resData.data.info];
  }

  /**
   * Create a new admin with a new account
   * @param {string} email 
   * @param {string} password 
   * @param {string} name 
   * @throws {AdminError}
   * @return {array} [newAdminProfile, newAdminInfo]
   */
  async createWithNewAccount(email, password, name) {
    const idToken = await firebaseAuth.currentUser.getIdToken();
    const adminId = firebaseAuth.currentUser.uid;
    const data = {
      rootAdminId: adminId,
      rootAdminToken: idToken,
      email: email,
      password: password,
      name: name,
    };

    const res = await cloudFunctionClient.post('/registerAdminWithNewAccount', data);
    const resData = res.data;

    if (res.status != 200) {
      throw new AuthError(resData.error.code, resData.error.message);
    }
    if (resData.error.code !== 'admin-register/success') {
      throw new AuthError(resData.error.code, resData.error.message);
    }

    return [resData.data.profile, resData.data.info];
  }
}

export default AdminsAPI;