import { db, firebaseAuth } from '@utils/firebase';
import CurrentUserError from '../error/currentUserError';

export const getCurrentAdmin = async () => {
  const user = firebaseAuth.currentUser;

  if (user === null) {
    throw new CurrentUserError('invalid-current-user', 'invalid current user');
  }
  if (!user.emailVerified) {
    throw new CurrentUserError('invalid-current-user', 'current user email not verified');
  }

  const token = await user.getIdTokenResult();
  if (!token.claims.admin) {
    throw new CurrentUserError('invalid-current-user', 'current user does not have admin role');
  }

  const snapshot = await db.collection('administrators').doc(user.uid).get();
  if (!snapshot.exists) {
    throw new CurrentUserError('invalid-current-user', 'admin does not exist');
  }
  return snapshot.data();
};

export const getCurrentAdminEditorAndAbove = async () => {
  const user = firebaseAuth.currentUser;

  if (user === null) {
    throw new CurrentUserError('invalid-current-user', 'invalid current user');
  }
  if (!user.emailVerified) {
    throw new CurrentUserError('invalid-current-user', 'current user email not verified');
  }

  const token = await user.getIdTokenResult();
  if (!token.claims.admin && !token.claims.adminEditor) {
    throw new CurrentUserError('invalid-current-user', 'current user does have editor role and above');
  }

  const snapshot = await db.collection('administrators').doc(user.uid).get();
  if (!snapshot.exists) {
    throw new CurrentUserError('invalid-current-user', 'admin does not exist');
  }
  return snapshot.data();
};

export const getCurrentAdminVerifierAndAbove = async () => {
  const user = firebaseAuth.currentUser;

  if (user === null) {
    throw new CurrentUserError('invalid-current-user', 'invalid current user');
  }
  if (!user.emailVerified) {
    throw new CurrentUserError('invalid-current-user', 'current user email not verified');
  }

  const token = await user.getIdTokenResult();
  if (!token.claims.admin && !token.claims.adminEditor && !token.claims.adminVerifier) {
    throw new CurrentUserError('invalid-current-user', 'current user does not have verifier role and above');
  }

  const snapshot = await db.collection('administrators').doc(user.uid).get();
  if (!snapshot.exists) {
    throw new CurrentUserError('invalid-current-user', 'admin does not exist');
  }
  return snapshot.data();
};
