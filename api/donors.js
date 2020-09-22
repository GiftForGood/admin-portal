import { db, firebase } from '@utils/firebase';
import { DONOR_BATCH_SIZE } from '@constants/batchSize';
import { DONOR_TYPES, isValidFilterType, ACTIONS } from '@constants/donor';
import { getCurrentAdminVerifierAndAbove } from './common/currentUser';
import DonorError from './error/donorError';

const donorsCollection = db.collection('donors');

class DonorCollectionsAPI {
  /**
   * Get a batch of donors by type. Only return results of NPO_ORGANIZATION_BATCH_SIZE
   * @param {string} filterType Check constants/donor.js to see all the valid filter type
   * @param {object} lastQueriedDocument last queried firebase document to start the query after. If the field is not given, the query will start from the first document
   * @throws {DonorError}
   * @throws {FirebaseError}
   * @return {array} A list firebase documents of the donor infos, ordered by descending order of joined date time
   *
   */
  async getAll(filterType = DONOR_TYPES.ALL, lastQueriedDocument = null) {
    if (!isValidFilterType(filterType)) {
      throw new DonorError(
        'invalid-parameters',
        `"${filterType}" is not a valid filter type. Only ${Object.values(DONOR_TYPES)} are valid.`
      );
    }

    let query = donorsCollection;
    if (filterType === DONOR_TYPES.NORMAL) {
      query = query.where('isCorporatePartner', '==', false);
    }

    if (filterType === DONOR_TYPES.CORPORATE) {
      query = query.where('isCorporatePartner', '==', true);
    }

    query = query.orderBy('joinedDateTime', 'desc');

    if (lastQueriedDocument !== null) {
      query = query.startAfter(lastQueriedDocument);
    }

    const snapshot = await query.limit(DONOR_BATCH_SIZE).get();
    return snapshot.docs;
  }

  /**
   * Get a donor by id.
   * @param {string} id the id of the donor
   * @throws {DonorError}
   * @throws {FirebaseError}
   * @return {object} A firebase document of the donor info
   */
  async get(id) {
    return donorsCollection.doc(id).get();
  }

  /**
   *
   * Search for the donor that has an email that is exactly the search term
   * @param {string} email the email string to search for
   * @throws {FirebaseError}
   * @return {object} A firebase document of the donor info
   */
  async searchByEmail(email) {
    const snapshot = await donorsCollection.where('email', '==', email.trim()).get();
    return snapshot.docs[0];
  }

  /**
   * Converts existing normal donor to corporate donor
   * @param {string} id the id of the donor to be converted to corporate donor
   * @throws {DonorError}
   * @throws {FirebaseError}
   * @return {object} A firebase document of the updated donor info
   */
  async makeCorporate(id) {
    let admin;
    try {
      admin = await getCurrentAdminVerifierAndAbove();
    } catch (err) {
      throw new DonorError('invalid-current-user', err.message);
    }

    const snapshot = await this.get(id);
    if (!snapshot.exists) {
      throw new DonorError('invalid-donor', 'Donor does not exist');
    }
    if (snapshot.data().isCorporatePartner) {
      throw new DonorError('invalid-conversion', 'Donor is already a corporate donor');
    }

    let ref = donorsCollection.doc(id);
    const donorConversionInfo = {
      isCorporatePartner: true,
    };
    const actionInfo = {
      type: ACTIONS.MAKE_CORPORATE,
      name: admin.name,
      email: admin.email,
      appliedDateTime: firebase.firestore.FieldValue.serverTimestamp(),
    }
    await ref.update(donorConversionInfo);
    ref.collection('actionsByAdmin').add(actionInfo);

    return ref.get();
  }

  /**
   * Converts corporate donor to existing normal donor
   * @param {string} id the id of the donor
   * @throws {DonorError}
   * @throws {FirebaseError}
   * @return {object} A firebase document of the updated donor info
   */
  async revokeCorporate(id) {
    let admin;
    try {
      admin = await getCurrentAdminVerifierAndAbove();
    } catch (err) {
      throw new DonorError('invalid-current-user', err.message);
    }

    const snapshot = await this.get(id);
    if (!snapshot.exists) {
      throw new DonorError('invalid-donor', 'Donor does not exist');
    }
    if (!snapshot.data().isCorporatePartner) {
      throw new DonorError('invalid-conversion', 'Donor is not a corporate donor');
    }

    let ref = donorsCollection.doc(id);
    const donorConversionInfo = {
      isCorporatePartner: false,
    };
    const actionInfo = {
      type: ACTIONS.REVOKE_CORPORATE,
      name: admin.name,
      email: admin.email,
      appliedDateTime: firebase.firestore.FieldValue.serverTimestamp(),
    }
    await ref.update(donorConversionInfo);
    ref.collection('actionsByAdmin').add(actionInfo);

    return ref.get();
  }

  /**
   * TODO: wait for tjy
   * Ban a donor
   * @param {string} id
   * @throws {DonorError}
   * @throws {FirebaseError}
   * @return {object} A firebase document of the banned donor info
   */
  async ban(id) {
    // let admin;
    // try {
    //   admin = await getCurrentAdminVerifierAndAbove();
    // } catch (err) {
    //   throw new DonorError('invalid-current-user', err.message);
    // }
    // const snapshot = await donorsCollection.doc(id).get();
    // if (!snapshot) throw new DonorError('invalid-donor', 'Donor does not exist');
    // if (snapshot.data().isBlocked) {
    //   throw new DonorError('invalid-ban', 'Donor is already banned');
    // }
    // let ref = donorsCollection.doc(id);
    // const banInfo = {
    //   isBlocked: true,
    //   blockedByAdmin: {
    //     id: admin.adminId,
    //     name: admin.name,
    //   },
    // };
    // await ref.update(banInfo);
    // return ref.get();
  }
}

export default DonorCollectionsAPI;
