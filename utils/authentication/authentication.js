import { client } from '../axios';

/**
 * Checks if a user is authenticated or not.
 *  req: The request from getServerSideProps
 *  res: The response from getServerSideProps
 *  destination: An object containing "Location" [Optional]
 *
 * Eg:
 *   let user = isAuthenticated(user, res, { Location: '/register'});
 *   let user = isAuthenticated(user, res);
 */
export async function isAuthenticated(req, res, destination = {}) {
  try {
    if (!req.headers.cookie) {
      throw new Error('Not Authenticated');;
    }
    const response = await client.get('/api/silentLogin', {
      headers: {
        cookie: req.headers.cookie,
      },
    });
    if (response.status === 200) {
      return response.data;
    }
    if (!destination.hasOwnProperty('Location')) {
      return null;
    }
    throw new Error('Not Authenticated');
  } catch (error) {
    if (!destination.hasOwnProperty('Location')) {
      return null;
    }
    res.writeHead(302, destination);
    res.end();
    return null;
  }
}
