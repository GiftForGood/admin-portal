import { db } from '@utils/firebase';
import { DONOR_BATCH_SIZE } from '@constants/batchSize';
import { DONOR_TYPES, isValidFilterType } from '@constants/donor';
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
   * @return {array} A list firebase documents of the donor infos
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
   * NOTE: wait until emulator is up, then only test
   * Converts existing normal donor to corporate donor
   * @param {string} id the id of the donor to be converted to corporate donor
   * @throws {DonorError}
   * @throws {FirebaseError}
   * @return {object} A firebase document of the updated donor info
   */
  // async makeDonorCorporate(id) {
  //   let admin;
  //   try {
  //     admin = await getCurrentAdminVerifierAndAbove();
  //   } catch (err) {
  //     throw new DonorError('invalid-current-user', err.message);
  //   }

  //   const snapshot = await donorsCollection.get(id);

  //   if (!snapshot) throw new DonorError('invalid-donor', 'Donor does not exist');

  //   if (snapshot.data().isCorporate) {
  //     throw new DonorError('invalid-conversion', 'Donor is already a corporate donor');
  //   }

  //   let ref = donorsCollection.doc(id);
  //   const conversionInfo = {
  //     isCorporatePartner: true,
  //     admin: {
  //       id: admin.adminId,
  //       name: admin.name,
  //     }
  //   }
  //   await ref.update(conversionInfo);

  //   return ref.get();
  // }

  /**
   * NOTE: wait until emulator is up, then only test
   * Ban a donor
   * @param {string} id
   * @throws {DonorError}
   * @throws {FirebaseError}
   * @return {object} A firebase document of the banned donor info
   */
  async ban(id) {}
}

export default DonorCollectionsAPI;
