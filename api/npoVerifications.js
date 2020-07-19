import { db } from '../utils/firebase';
import { NPO_VERIFICATION_BATCH_SIZE } from '../utils/constants/batchSize';
import { STATUS_FILTER_TYPE, ORDER_BY, STATUS, ACTIONS } from '../utils/constants/npoVerification';
import { isValidStatusFilterType, isValidOrderBy } from '../utils/constants/npoVerification';
import { getCurrentAdmin } from './common/currentUser';
import NPOVerificationError from './error/npoVerificationError';

const npoVerificationsCollection = db.collection('npoVerifications');
const nposCollections = db.collection('npos');

class NPOVerifications {
  /**
   * Get a batch of npo verifications. Only return results of NPO_VERIFICATION_BATCH_SIZE
   * @param {string} statusFilterType Check constants/npoVerification.js to see all the valid status filter type
   * @param {string} orderBy Check constants/npoVerification.js to see all the valid order type
   * @param {boolean} isReverse Indicates if the query should be ordered in reverse
   * @param {object} lastQueriedDocument last queried firebase document to start the query after. If the field is not given, the query will start from the first document
   * @throws {NPOVerificationError}
   * @throws {FirebaseError}
   * @return {array} A list of firebase document of all the npo verifications
   */
  async getAll(
    statusFilterType = STATUS_FILTER_TYPE.ALL,
    orderBy = ORDER_BY.LAST_UPDATED_DATE,
    isReverse = false,
    lastQueriedDocument = null
  ) {
    if (!isValidStatusFilterType(statusFilterType)) {
      return new NPOVerificationError(
        'invalid-parameters',
        `"${statusFilterType}" is not a valid filter type. Only ${Object.values(STATUS_FILTER_TYPE)} are valid.`
      );
    }
    if (!isValidOrderBy(orderBy)) {
      return new NPOVerificationError(
        'invalid-parameters',
        `"${orderBy}" is not a valid order by type. Only ${Object.values(ORDER_BY)} are valid.`
      );
    }

    let sortOrder = 'asc';
    if (isReverse) {
      sortOrder = 'desc';
    }

    let query = npoVerificationsCollection;
    if (statusFilterType !== STATUS_FILTER_TYPE.ALL) {
      query = query.where('status', '==', statusFilterType);
    }
    query = query.orderBy(orderBy, sortOrder);
    if (lastQueriedDocument !== null) {
      query = query.startAfter(lastQueriedDocument);
    }

    const snapshot = await query.limit(NPO_VERIFICATION_BATCH_SIZE).get();
    return snapshot.docs;
  }

  /**
   * Get a verification
   * @param {string} id npo id
   * @throws {FirebaseError}
   * @return {object} A firebase document of the npo verification
   */
  async get(id) {
    return npoVerificationsCollection.doc(id).get();
  }

  /**
   * Get all admin actions on a verification sorted by actions applied date
   * @param {string} id
   * @param {boolean} isReverse Indicates if the query should be ordered in reverse
   * @throws {FirebaseError}
   * @return {array} A list of firebase documents of admin actions
   */
  async getAllAdminActions(id, isReverse = true) {
    let sortOrder = 'asc';
    if (isReverse) {
      sortOrder = 'desc';
    }

    const snapshot = await npoVerificationsCollection
      .doc(id)
      .collection('actionsByAdmin')
      .orderBy('appliedDateTime', sortOrder)
      .get();
    return snapshot.docs;
  }

  /**
   * Lock the verifications for review
   * @param {string} id npo id
   * @throws {NPOVerificationsError}
   * @throws {FirebaseError}
   * @return {object} A firebase document of the locked verification
   */
  async lockForReview(id) {
    let admin;
    try {
      admin = await getCurrentAdmin();
    } catch (err) {
      throw new NPOVerificationError('invalid-current-user', err.message);
    }

    const snapshot = await this.get(id);
    const verification = snapshot.data();

    if (verification.status !== STATUS.PENDING && verification.status !== STATUS.RESUBMISSION) {
      throw new NPOVerificationError(
        'invalid-status',
        'Only can lock verifications that are pending or on resubmission'
      );
    }

    const timeNow = Date.now();
    const verificationInfo = {
      status: STATUS.REVIEWING,
      admin: {
        id: admin.adminId,
        name: admin.name,
      },
    };
    const actionsInfo = {
      type: ACTIONS.LOCK,
      name: admin.name,
      email: admin.email,
      appliedDateTime: timeNow,
    };

    let ref = npoVerificationsCollection.doc(id);
    await ref.update(verificationInfo);
    ref.collection('actionsByAdmin').add(actionsInfo);

    return ref.get();
  }

  /**
   * Unlock the verification for review
   * @param {string} id npo id
   * @throws {NPOVerificationsError}
   * @throws {FirebaseError}
   * @return {object} A firebase document of the unlocked verification
   */
  async unlockForReview(id) {
    let admin;
    try {
      admin = await getCurrentAdmin();
    } catch (err) {
      throw new NPOVerificationError('invalid-current-user', err.message);
    }

    const snapshot = await this.get(id);
    const verification = snapshot.data();

    if (verification.status !== STATUS.REVIEWING) {
      throw new NPOVerificationError('invalid-status', 'Only can unlock verifications that are reviewing');
    }

    const timeNow = Date.now();
    const verificationInfo = {
      status: STATUS.PENDING,
      admin: {
        id: '',
        name: '',
      },
    };
    const actionsInfo = {
      type: ACTIONS.UNLOCK,
      name: admin.name,
      email: admin.email,
      appliedDateTime: timeNow,
    };

    let ref = npoVerificationsCollection.doc(id);
    await ref.update(verificationInfo);
    ref.collection('actionsByAdmin').add(actionsInfo);

    return ref.get();
  }

  /**
   * Accept a verification
   * @param {string} id npo id
   * @throws {NPOVerificationsError}
   * @throws {FirebaseError}
   * @return {object} A firebase document of the accepted verification
   */
  async accept(id) {
    let admin;
    try {
      admin = await getCurrentAdmin();
    } catch (err) {
      throw new NPOVerificationError('invalid-current-user', err.message);
    }

    const snapshot = await this.get(id);
    const verification = snapshot.data();

    if (verification.status !== STATUS.REVIEWING) {
      throw new NPOVerificationError('invalid-status', 'Only can accept verifications that are reviewing');
    }

    const timeNow = Date.now();
    const verificationInfo = {
      status: STATUS.ACCEPTED,
      admin: {
        id: admin.adminId,
        name: admin.name,
      },
      isVerifiedByAdmin: true,
    };
    const actionsInfo = {
      type: ACTIONS.ACCEPT,
      name: admin.name,
      email: admin.email,
      appliedDateTime: timeNow,
    };
    const npoInfo = {
      isVerifiedByAdmin: true,
    };

    let ref = npoVerificationsCollection.doc(id);
    await ref.update(verificationInfo);
    ref.collection('actionsByAdmin').add(actionsInfo);
    await nposCollections.doc(id).update(npoInfo);

    // TODO: Send email

    return ref.get();
  }

  /**
   * Reject a verification
   * @param {string} id npo id
   * @param {string} reason The reason for rejecting the verification
   * @throws {NPOVerificationError}
   * @throws {FirebaseError}
   * @return {object} A firebase document of the accepted verification
   */
  async reject(id, reason) {
    let admin;
    try {
      admin = await getCurrentAdmin();
    } catch (err) {
      throw new NPOVerificationError('invalid-current-user', err.message);
    }

    const snapshot = await this.get(id);
    const verification = snapshot.data();

    if (verification.status !== STATUS.REVIEWING) {
      throw new NPOVerificationError('invalid-status', 'Only can accept verifications that are reviewing');
    }

    const timeNow = Date.now();
    const verificationInfo = {
      status: STATUS.REJECTED,
      admin: {
        id: admin.adminId,
        name: admin.name,
      },
    };
    const actionsInfo = {
      type: ACTIONS.REJECT,
      name: admin.name,
      email: admin.email,
      reason: reason,
      appliedDateTime: timeNow,
    };

    let ref = npoVerificationsCollection.doc(id);
    await ref.update(verificationInfo);
    ref.collection('actionsByAdmin').add(actionsInfo);

    // TODO: Send email

    return ref.get();
  }

  /**
   * Request a verification to be resubmitted
   * @param {string} id npo id
   * @param {string} reason The reason for rejecting the verification
   * @throws {NPOVerificationError}
   * @throws {FirebaseError}
   * @return {object} A firebase document of the verification to be resubmitted
   */
  async requestForResubmission(id, reason) {
    let admin;
    try {
      admin = await getCurrentAdmin();
    } catch (err) {
      throw new NPOVerificationError('invalid-current-user', err.message);
    }

    const snapshot = await this.get(id);
    const verification = snapshot.data();

    if (verification.status !== STATUS.REVIEWING) {
      throw new NPOVerificationError('invalid-status', 'Only can accept verifications that are reviewing');
    }

    const timeNow = Date.now();
    const verificationInfo = {
      status: STATUS.RESUBMISSION,
      admin: {
        id: admin.adminId,
        name: admin.name,
      },
    };
    const actionsInfo = {
      type: ACTIONS.RESUBMIT,
      name: admin.name,
      email: admin.email,
      reason: reason,
      appliedDateTime: timeNow,
    };

    let ref = npoVerificationsCollection.doc(id);
    await ref.update(verificationInfo);
    ref.collection('actionsByAdmin').add(actionsInfo);

    // TODO: Send email

    return ref.get();
  }
}

export default NPOVerifications;
