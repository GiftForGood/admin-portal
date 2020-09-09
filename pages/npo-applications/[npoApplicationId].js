import React from 'react';
import { isAuthenticated } from '@utils/authentication/authentication';
import api from '@api';
import SessionProvider from '@components/session/modules/SessionProvider';
import MaxWidthContainer from '@components/containers/MaxWidthContainer';
import NpoApplicationPage from '@components/npo-applications/pages/NpoApplicationPage';

import dynamic from 'next/dynamic';
const TopNavigationBar = dynamic(() => import('@components/navbar/modules/TopNavigationBar'), { ssr: false });

export async function getServerSideProps({ params, req, res, query }) {
  const npoApplicationId = params.npoApplicationId;
  const data = await isAuthenticated(req, res, { Location: '/' });
  return {
    props: {
      npoApplicationId,
      user: data.user || null,
    },
  };
}

const NpoApplication = ({ npoApplicationId, user }) => {
  return (
    <SessionProvider user={user}>
      <TopNavigationBar />

      <MaxWidthContainer>
        <NpoApplicationPage npoApplicationId={npoApplicationId} />
      </MaxWidthContainer>
    </SessionProvider>
  );
};

export default NpoApplication;
