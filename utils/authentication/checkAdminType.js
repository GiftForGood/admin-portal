export const isAdmin = (user, res, destination = {}) => {
  try {
    // Admin
    if (user.admin && user.emailVerified) {
      return true;
    }

    // Not Admin
    if (!destination.hasOwnProperty('Location')) {
      return false;
    }
    throw new Error('Not Admin');
  } catch (error) {
    res.writeHead(302, destination);
    res.end();
    return null;
  }
};

export const isAdminEditorAndAbove = (user, res, destination = {}) => {
  try {
    // Admin or AdminEditor
    if ((user.admin || user.adminEditor) && user.emailVerified) {
      return true;
    }

    // Not Admin or AdminEditor
    if (!destination.hasOwnProperty('Location')) {
      return false;
    }
    throw new Error('Not Admin or AdminEditor');
  } catch (error) {
    res.writeHead(302, destination);
    res.end();
    return null;
  }
};

export const isAdminVerifierAndAbove = (user, res, destination = {}) => {
  try {
    // Admin or AdminEditor or AdminVerifier
    if ((user.admin || user.adminEditor || user.adminVerifier) && user.emailVerified) {
      return true;
    }

    // Not Admin or AdminEditor or AdminVerifier
    if (!destination.hasOwnProperty('Location')) {
      return false;
    }
    throw new Error('Not Admin or AdminEditor or AdminVerifier');
  } catch (error) {
    res.writeHead(302, destination);
    res.end();
    return null;
  }
};
