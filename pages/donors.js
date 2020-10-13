import React from 'react';
import { isAuthenticated } from '@utils/authentication/authentication';
import SessionProvider from '@components/session/modules/SessionProvider';
import MaxWidthContainer from '@components/containers/MaxWidthContainer';
import DonorsPage from '@components/donors/pages/DonorsPage';
import { isAdmin } from '@utils/authentication/checkAdminType';

import dynamic from 'next/dynamic';
const TopNavigationBar = dynamic(() => import('@components/navbar/modules/TopNavigationBar'), { ssr: false });

export async function getServerSideProps({ params, req, res, query }) {
  let data = await isAuthenticated(req, res, { Location: '/' });
  isAdmin(data.user, res, { Location: '/dashboard' });
  return {
    props: {
      user: data.user || null,
    },
  };
}

const Donors = ({ user }) => {
  return (
    <SessionProvider user={user}>
      <TopNavigationBar />

      <MaxWidthContainer>
        <DonorsPage />
      </MaxWidthContainer>
    </SessionProvider>
  );
};

export default Donors;
