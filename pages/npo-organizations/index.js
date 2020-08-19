import React from 'react';
import { isAuthenticated } from '../../utils/authentication/authentication';
import SessionProvider from '../../src/components/session/modules/SessionProvider';
import MaxWidthContainer from '../../src/components/containers/MaxWidthContainer';
import NpoOrganizationsPage from '../../src/components/npo-organizations/pages/NpoOrganizationsPage';

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
