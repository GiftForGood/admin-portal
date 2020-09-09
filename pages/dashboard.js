import React from 'react';
import { isAuthenticated } from '@utils/authentication/authentication';
import SessionProvider from '@components/session/modules/SessionProvider';
import dynamic from 'next/dynamic';
const TopNavigationBar = dynamic(() => import('@components/navbar/modules/TopNavigationBar'), { ssr: false });

export async function getServerSideProps({ params, req, res, query }) {
  let data = await isAuthenticated(req, res, { Location: '/' });
  return {
    props: {
      user: data.user || null,
    },
  };
}

const Dashboard = ({ user }) => {
  return (
    <SessionProvider user={user}>
      <TopNavigationBar />

      <div>Dashboard {user && user.email}</div>
    </SessionProvider>
  );
};

export default Dashboard;
