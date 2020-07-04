import { db, firebaseAuth, firebaseStorage } from '../utils/firebase';
import { BASE_URL } from '../utils/constants/siteUrl';

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
	 * @return {Promise}
	 */
	async signInWithEmailLink(email, url) {
		return firebaseAuth.signInWithEmailLink(email, url);
	}
}

export default AuthAPI;
