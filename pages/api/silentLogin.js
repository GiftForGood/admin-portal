import admin from '../../utils/admin-firebase';
import cookie from 'cookie';
import { cors } from '../../utils/middleware/cors';

async function handler(req, res) {
  await cors(req, res);

  const { method } = req;
  switch (method) {
    case 'GET':
      const cookies = cookie.parse(req.headers.cookie || '');
      const sessionCookie = cookies.session || '';
      // Verify the session cookie. In this case an additional check is added to detect
      // if the user's Firebase session was revoked, user deleted/disabled, etc.
      try {
        let decodedClaims = await admin.auth().verifySessionCookie(sessionCookie, true /** checkRevoked */);
        let currentUser = await admin.auth().getUser(decodedClaims.uid);
        let user = await getUser(currentUser.customClaims, currentUser.uid);
        // Checking for user type from 2 different sources because Cloud function doesnt update the claims fast enough.
        res.json({
          user: {
            ...user,
            admin: decodedClaims.admin || currentUser.customClaims.admin,
            emailVerified: currentUser.emailVerified,
            email: decodedClaims.email,
          },
        });
      } catch (error) {
        // Session cookie is unavailable or invalid. Force user to login.
        res.status(401).json({
          error: {
            message: 'Unauthorized request',
          },
        });
      }

      break;
    default:
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

async function getUser(decodedClaims, uid) {
  let doc = await admin.firestore().collection('administrators').doc(uid).get();
  return doc.data();
}

export default handler;
