import { db, firebaseAuth } from '../../utils/firebase';
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
    throw new CurrentUserError('invalid-current-user', 'current user is not an admin');
  }

  const snapshot = await db.collection('administrators').doc(user.uid).get();
  if (!snapshot.exists) {
    throw new CurrentUserError('invalid-current-user', 'admin does not exist');
  }
  return snapshot.data();
};
