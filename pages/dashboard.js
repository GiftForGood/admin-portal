import React from 'react';
import { isAuthenticated } from '../utils/authentication/authentication';
import api from '../api';
import { client } from '../utils/axios';
import SessionProvider from '../src/components/session/modules/SessionProvider';

export async function getServerSideProps({ params, req, res, query }) {
  let data = await isAuthenticated(req, res, { Location: '/' });
  return {
    props: {
      user: data.user || null,
    },
  };
}

const Dashboard = ({ user }) => {
  const logout = async () => {
    await api.auth.logout();
    let response = await client.post('/api/sessionLogout');
    if (response.status === 200) {
    } else {
      throw response.error;
    }
  };
  return (
    <SessionProvider user={user}>
      <div>Dashboard {user && user.email}</div>
      <button onClick={() => logout()}>Logout</button>
    </SessionProvider>
  );
};

export default Dashboard;
