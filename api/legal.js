import { db, firebaseAuth } from '@utils/firebase';
import { LEGAL_TYPE, isValidType } from '@constants/legal';
import LegalError from './error/legalError';

const legalCollection = db.collection('legal');

class LegalAPI {
  async get(type) {
    if (!isValidType(type)) {
      return new LegalError(
        'invalid-parameters',
        `${type} is not a valid legal type. Only ${Object.values(LEGAL_TYPE)} are valid.`
      );
    }

    const snapshot = await legalCollection.doc(type).get();
    return snapshot.data();
  }

  async update(content, type) {
    if (!isValidType(type)) {
      return new LegalError(
        'invalid-parameters',
        `${type} is not a valid legal type. Only ${Object.values(LEGAL_TYPE)} are valid.`
      );
    }

    const legalDoc = legalCollection.doc(type);

    const data = {
      content,
    };
    await legalDoc.update(data);

    return (await legalDoc.get()).data();
  }
}

export default LegalAPI;
