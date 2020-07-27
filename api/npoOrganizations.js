import { db } from '../utils/firebase';
import { NPO_ORGANIZATION_BATCH_SIZE } from '../utils/constants/batchSize';
import { TYPE_FILTER_TYPE, SECTOR_FILTER_TYPE, ORDER_BY } from '../utils/constants/npoOrganization';
import { isValidTypeFilterType, isValidSectorFilterType, isValidOrderBy } from '../utils/constants/npoOrganization';
import NPOOrganizationError from './error/npoOrganizationError';

const npoOrganizationsCollection = db.collection('npoOrganizations');

class NPOOrganizationsAPI {
  /**
   * Get a batch of npo organization infos by type. Only return results of NPO_ORGANIZATION_BATCH_SIZE
   * @param {string} typeFilterType Check constants/npoOrganization.js to see all the valid type filter type
   * @param {string} orderBy Check constants/npoOrganization.js to see all the valid order type
   * @param {boolean} isReverse Indicates if the query should be ordered in reverse
   * @param {object} lastQueriedDocument last queried firebase document to start the query after. If the field is not given, the query will start from the first document
   * @throws {NPOOrganizationError}
   * @throws {FirebaseError}
   * @return {array} A list firebase documents of the npo organization infos
   */
  async getAllByType(
    typeFilterType = TYPE_FILTER_TYPE.ALL,
    orderBy = ORDER_BY.NAME,
    isReverse = false,
    lastQueriedDocument = null
  ) {
    if (!isValidTypeFilterType(typeFilterType)) {
      throw new NPOOrganizationError(
        'invalid-parameters',
        `"${typeFilterType}" is not a valid filter type. Only ${Object.values(TYPE_FILTER_TYPE)} are valid.`
      );
    }
    if (!isValidOrderBy(orderBy)) {
      throw new NPOOrganizationError(
        'invalid-parameters',
        `"${orderBy}" is not a valid order by type. Only ${Object.values(ORDER_BY)} are valid.`
      );
    }

    let sortOrder = 'asc';
    if (isReverse) {
      sortOrder = 'desc';
    }

    let query = npoOrganizationsCollection;
    if (typeFilterType !== TYPE_FILTER_TYPE.ALL) {
      query = query.where('type', '==', typeFilterType);
    }
    query = query.orderBy(orderBy, sortOrder);
    if (lastQueriedDocument !== null) {
      query = query.startAfter(lastQueriedDocument);
    }

    const snapshot = await query.limit(NPO_ORGANIZATION_BATCH_SIZE).get();
    return snapshot.docs;
  }

  /**
   * Get a batch of npo organization infos by sector. Only return results of NPO_ORGANIZATION_BATCH_SIZE
   * @param {string} sectorFilterType Check constants/npoOrganization.js to see all the valid type filter type
   * @param {string} orderBy Check constants/npoOrganization.js to see all the valid order type
   * @param {boolean} isReverse Indicates if the query should be ordered in reverse
   * @param {object} lastQueriedDocument last queried firebase document to start the query after. If the field is not given, the query will start from the first document
   * @throws {NPOOrganizationError}
   * @throws {FirebaseError}
   * @return {array} A list firebase documents of the npo organization infos
   */
  async getAllBySector(
    sectorFilterType = SECTOR_FILTER_TYPE.ALL,
    orderBy = ORDER_BY.NAME,
    isReverse = false,
    lastQueriedDocument = null
  ) {
    if (!isValidSectorFilterType(sectorFilterType)) {
      throw new NPOOrganizationError(
        'invalid-parameters',
        `"${sectorFilterType}" is not a valid filter type. Only ${Object.values(SECTOR_FILTER_TYPE)} are valid.`
      );
    }
    if (!isValidOrderBy(orderBy)) {
      throw new NPOOrganizationError(
        'invalid-parameters',
        `"${orderBy}" is not a valid order by type. Only ${Object.values(ORDER_BY)} are valid.`
      );
    }

    let sortOrder = 'asc';
    if (isReverse) {
      sortOrder = 'desc';
    }

    let query = npoOrganizationsCollection;
    if (sectorFilterType !== SECTOR_FILTER_TYPE.ALL) {
      query = query.where('sector', '==', sectorFilterType);
    }
    query = query.orderBy(orderBy, sortOrder);
    if (lastQueriedDocument !== null) {
      query = query.startAfter(lastQueriedDocument);
    }

    const snapshot = await query.limit(NPO_ORGANIZATION_BATCH_SIZE).get();
    return snapshot.docs;
  }

  /**
   * Get a npo organization info
   * @param {string} name the name of the npo organization
   * @throws {NPOOrganizationError}
   * @throws {FirebaseError}
   * @return {object} A firebase document of the npo organization info
   */
  async getByName(name) {
    const snapshot = await npoOrganizationsCollection.where('name', '==', name).get();

    if (snapshot.empty) {
      throw new NPOOrganizationError('organization-does-not-exist', `organization with name of ${name} does not exist`);
    }

    return snapshot.docs[0];
  }

  /**
   * Get a npo organization info
   * @param {string} uen UEN of the npo organization
   * @throws {NPOOrganizationError}
   * @throws {FirebaseError}
   * @return {object} A firebase document of the npo organization info
   */
  async getByUEN(uen) {
    const snapshot = await npoOrganizationsCollection.where('uen', '==', uen.toUpperCase()).get();

    if (snapshot.empty) {
      throw new NPOOrganizationError('organization-does-not-exist', `organization with UEN of ${uen} does not exist`);
    }

    return snapshot.docs[0];
  }
}

export default NPOOrganizationsAPI;
