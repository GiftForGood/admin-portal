import React from 'react';
import { isAuthenticated } from '@utils/authentication/authentication';
import SessionProvider from '@components/session/modules/SessionProvider';
import MaxWidthContainer from '@components/containers/MaxWidthContainer';
import NpoOrganizationsPage from '@components/npo-organizations/pages/NpoOrganizationsPage';

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

const NpoOrganizations = ({ user }) => {
  return (
    <SessionProvider user={user}>
      <TopNavigationBar />

      <MaxWidthContainer>
        <NpoOrganizationsPage />
      </MaxWidthContainer>
    </SessionProvider>
  );
};

export default NpoOrganizations;
