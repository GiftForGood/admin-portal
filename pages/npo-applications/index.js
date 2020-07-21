import React from 'react';
import { isAuthenticated } from '../../utils/authentication/authentication';
import SessionProvider from '../../src/components/session/modules/SessionProvider';
import dynamic from 'next/dynamic';
const TopNavigationBar = dynamic(() => import('../../src/components/navbar/modules/TopNavigationBar'), { ssr: false });

export async function getServerSideProps({ params, req, res, query }) {
  let data = await isAuthenticated(req, res, { Location: '/' });
  return {
    props: {
      user: data.user || null,
    },
  };
}

const NpoApplications = ({ user }) => {
  return (
    <SessionProvider user={user}>
      <TopNavigationBar />

      <div>NPO applications {user && user.email}</div>
    </SessionProvider>
  );
};

export default NpoApplications;