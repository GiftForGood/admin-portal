import React from 'react';
import { isAuthenticated } from '@utils/authentication/authentication';
import SessionProvider from '@components/session/modules/SessionProvider';
import MaxWidthContainer from '@components/containers/MaxWidthContainer';
import NpoApplicationsPage from '@components/npo-applications/pages/NpoApplicationsPage';

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

const NpoApplications = ({ user }) => {
  return (
    <SessionProvider user={user}>
      <TopNavigationBar />

      <MaxWidthContainer>
        <NpoApplicationsPage />
      </MaxWidthContainer>
    </SessionProvider>
  );
};

export default NpoApplications;
