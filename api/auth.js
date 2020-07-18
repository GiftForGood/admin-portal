import { db, firebaseAuth } from '../utils/firebase';
import { BASE_URL } from '../utils/constants/siteUrl';

const administratorsCollection = db.collection('administrators');

class AuthAPI {
  /**
   * Send the authentication link to the user's email
   * @param {string} email
   * @throws {FirebaseError}
   * @return {Promise}
   */
  async sendSignInLinkToEmail(email) {
    const url = BASE_URL + '/';
    const actionCodeSettings = {
      url: url,
      handleCodeInApp: true,
    };

    return firebaseAuth.sendSignInLinkToEmail(email, actionCodeSettings);
  }

  /**
   * Checks if an incoming link is a sign-in with email link
   * @param {string} url of the link sent to the user
   * @return {boolean}
   */
  async isSignInWithEmailLink(url) {
    return firebaseAuth.isSignInWithEmailLink(url);
  }

  /**
   * Asynchronously signs in using an email and sign-in email link. If no link is passed, the link is inferred from the current URL
   * @param {string} email
   * @param {string} url of the link sent to the user
   * @throws {FirebaseError}
   * @return {array} [token, userDoc]
   *  token: JWT
   *  userDoc: Firebase document that contains the userInfo in the db
   */
  async signInWithEmailLink(email, url) {
    await firebaseAuth.signInWithEmailLink(email, url);
    const token = await firebaseAuth.currentUser.getIdToken();
    const userProfile = firebaseAuth.currentUser;
    const userDoc = await this._updateAdministratorLoginTime(userProfile.uid);
    return [token, userProfile, userDoc];
  }

  /**
   * Pre login check if the email given belongs to an administrator
   * @param {string} email
   */
  async isAdministrator(email) {
    const snapshot = await administratorsCollection.where('email', '==', email).get();
    if (snapshot.empty) {
      return false;
    }

    return true;
  }

  /**
   * Logout a user (admin)
   */
  async logout() {
    firebaseAuth.signOut();
  }

  async _updateAdministratorLoginTime(id) {
    const userDoc = administratorsCollection.doc(id);

    const data = {
      lastLoggedInDateTime: Date.now(),
    };
    await userDoc.update(data);

    return userDoc.get();
  }
}

export default AuthAPI;
