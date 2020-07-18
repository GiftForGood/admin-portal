import { db, firebaseAuth } from '../utils/firebase';
import { ORDER_BY } from '../utils/constants/admin';
import { isValidOrderBy } from '../utils/constants/admin';
import { cloudFunctionClient } from '../utils/axios';
import AdminError from './error/adminError';

const administratorsCollection = db.collection('administrators');

class AdminsAPI {
  /**
   * Get all the admin infos
   * @param {string} orderBy Check constants/admin.js to see all the valid order type
   * @param {boolean} isReverse Indicates if the query should be ordered in reverse
   * @throws {AdminError}
   * @throws {FirebaseError}
   * @return {object} A list of firebase document of all the admin infos
   */
  async getAll(orderBy = ORDER_BY.NAME, isReverse = false) {
    if (!isValidOrderBy(orderBy)) {
      return new AdminError('invalid-parameters', `${orderBy} is not a valid order by type. Only ${Object.values(ORDER_BY)} are valid.`); 
    }

    let sortOrder = 'asc';
    if (isReverse) {
      sortOrder = 'desc';
    }

    const snapshot = await administratorsCollection.orderBy(orderBy, sortOrder).get();
    return snapshot.docs;
  }

  /**
   * Get all the admin infos created by an admin
   * @param {string} createdAdminId 
   * @param {string} orderBy Check constants/admin.js to see all the valid order type
   * @param {boolean} isReverse Indicates if the query should be ordered in reverse
   * @throws {AdminError}
   * @throws {FirebaseError}
   * @return {object} A list of firebase document of all admin infos created by an another admin
   */
  async getAdminsCreatedByAdmin(createdAdminId, orderBy = ORDER_BY.NAME, isReverse = false) {
    if (!isValidOrderBy(orderBy)) {
      return new AdminError('invalid-parameters', `${orderBy} is not a valid order by type. Only ${Object.values(ORDER_BY)} are valid.`); 
    }

    let sortOrder = 'asc';
    if (isReverse) {
      sortOrder = 'desc';
    }

    const snapshot = await administratorsCollection.where('createdBy.adminId', '==', createdAdminId).orderBy(orderBy, sortOrder).get();
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
      throw new AdminError(resData.error.code, resData.error.message);
    }
    if (resData.error.code !== 'admin-register/success') {
      throw new AdminError(resData.error.code, resData.error.message);
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
      throw new AdminError(resData.error.code, resData.error.message);
    }
    if (resData.error.code !== 'admin-register/success') {
      throw new AdminError(resData.error.code, resData.error.message);
    }

    return [resData.data.profile, resData.data.info];
  }
}

export default AdminsAPI;