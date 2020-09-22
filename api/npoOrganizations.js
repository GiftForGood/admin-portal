import { db } from '@utils/firebase';
import { NPO_ORGANIZATION_BATCH_SIZE } from '@constants/batchSize';
import { TYPE_FILTER_TYPE, SECTOR_FILTER_TYPE, ORDER_BY, TYPE, SECTOR } from '@constants/npoOrganization';
import {
  isValidTypeFilterType,
  isValidSectorFilterType,
  isValidOrderBy,
  isValidType,
  isValidSector,
} from '@constants/npoOrganization';
import { getLocations } from './common/location';
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
   * @param {string} sectorFilterType Check constants/npoOrganization.js to see all the valid sector filter type
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
   * @param {string} id the id of the npo organization
   * @throws {FirebaseError}
   * @return {object} A firebase document of the npo organization info
   */
  async getById(id) {
    const snapshot = await npoOrganizationsCollection.doc(id).get();

    if (!snapshot.exists) {
      return null;
    }

    return snapshot;
  }

  /**
   * Get a npo organization info
   * @param {string} name the name of the npo organization
   * @throws {FirebaseError}
   * @return {object} A firebase document of the npo organization info
   */
  async getByName(name) {
    const snapshot = await npoOrganizationsCollection.where('name', '==', name).get();

    if (snapshot.empty) {
      return null;
    }

    return snapshot.docs[0];
  }

  /**
   * Get a npo organization info
   * @param {string} uen UEN of the npo organization
   * @throws {FirebaseError}
   * @return {object} A firebase document of the npo organization info
   */
  async getByUEN(uen) {
    const snapshot = await npoOrganizationsCollection.where('uen', '==', uen.toUpperCase()).get();

    if (snapshot.empty) {
      return null;
    }

    return snapshot.docs[0];
  }

  /**
   * Create a npo organization
   * @param {string} name The name of the npo organization. Should be unique
   * @param {string} type The type of npo organization. Check constants/npoOrganization.js to see all the valid type
   * @param {string} uen The UEN number
   * @param {string} address The address of the npo
   * @param {string} sector The sector the npo belong to. Check constants/npoOrganization.js to see all the valid sector type
   * @param {string} classification The classification that the npo belong to
   * @throws {NPOOrganizationError}
   * @throws {FirebaseError}
   * @return {object} A firebase document of the new npo organization info
   */
  async create(name, type, uen, address, sector, classification) {
    if (!isValidType) {
      throw new NPOOrganizationError(
        'invalid-npo-type',
        `"${type}" is not a valid npo type. Only ${Object.values(TYPE)} are valid.`
      );
    }
    if (!isValidSector) {
      throw new NPOOrganizationError(
        'invalid-npo-sector',
        `"${sector}" is not a valid sector. Only ${Object.value(SECTOR)} are valid.`
      );
    }

    const org = await this.getByName(name);
    if (org !== null) {
      throw new NPOOrganizationError('invalid-npo-name', `organization with "${name}" already exist`);
    }

    const locationsDetails = await getLocations([address]);
    if (locationsDetails === null || locationsDetails.length <= 0) {
      throw new NPOOrganizationError(
        'failed-to-fetch-lat-long',
        `Failed to fetch latitude and longitude for organization`
      );
    }

    let newOrganization = npoOrganizationsCollection.doc();
    const data = {
      id: newOrganization.id,
      name: name,
      type: type,
      uen: uen,
      address: address,
      latitude: locationsDetails[0].latitude,
      longitude: locationsDetails[0].longitude,
      sector: sector,
      classification: classification,
    };
    await newOrganization.set(data);

    return newOrganization.get();
  }

  /**
   * Update a npo organization information
   * @param {string} name The name of the npo organization. Should be unique
   * @param {string} type The type of npo organization. Check constants/npoOrganization.js to see all the valid type
   * @param {string} uen The UEN number
   * @param {string} address The address of the npo
   * @param {string} sector The sector the npo belong to. Check constants/npoOrganization.js to see all the valid sector type
   * @param {string} classification The classification that the npo belong to
   * @throws {NPOOrganizationError}
   * @throws {FirebaseError}
   * @return {object} A firebase document of the updated npo organization info
   */
  async update(id, name, address, classification, sector, type, uen) {
    if (!isValidType) {
      throw new NPOOrganizationError(
        'invalid-npo-type',
        `"${type}" is not a valid npo type. Only ${Object.values(TYPE)} are valid.`
      );
    }
    if (!isValidSector) {
      throw new NPOOrganizationError(
        'invalid-npo-sector',
        `"${sector}" is not a valid sector. Only ${Object.value(SECTOR)} are valid.`
      );
    }

    const ref = npoOrganizationsCollection.doc(id);
    const snapshot = await ref.get();
    if (!snapshot.exists) {
      throw new NPOOrganizationError('invalid-npo-id', `npo organization with id of ${id} already exist`);
    }

    const orgData = snapshot.data();
    let lat = orgData.latitude;
    let long = orgData.longitude;
    if (address != orgData.address) {
      const locationsDetails = await getLocations([address]);
      if (locationsDetails === null || locationsDetails.length <= 0) {
        throw new NPOOrganizationError(
          'failed-to-fetch-lat-long',
          `Failed to fetch latitude and longitude for organization`
        );
      }

      lat = locationsDetails[0].latitude;
      long = locationsDetails[0].longitude;
    }

    const data = {
      name: name,
      type: type,
      uen: uen,
      address: address,
      latitude: lat,
      longitude: long,
      sector: sector,
      classification: classification,
    };

    await ref.update(data);
    return ref.get();
  }
}

export default NPOOrganizationsAPI;
