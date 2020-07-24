import React from 'react';
import { isAuthenticated } from '../../utils/authentication/authentication';
import api from '../../api';
import SessionProvider from '../../src/components/session/modules/SessionProvider';
import MaxWidthContainer from '../../src/components/containers/MaxWidthContainer';
import NpoApplicationPage from '../../src/components/npo-applications/pages/NpoApplicationPage';

import dynamic from 'next/dynamic';
const TopNavigationBar = dynamic(() => import('../../src/components/navbar/modules/TopNavigationBar'), { ssr: false });

export async function getServerSideProps({ params, req, res, query }) {
  const npoApplicationId = params.npoApplicationId;
  const [npoApplicationDetails, data] = await Promise.all([
    getNpoApplicationDetails(npoApplicationId),
    isAuthenticated(req, res, { Location: '/' }),
  ]);
  return {
    props: {
      npoApplicationId,
      npoApplicationDetails,
      user: data.user || null,
    },
  };
}

const getNpoApplicationDetails = async (npoApplicationId) => {
  const appSnapshot = await api.npoVerifications.get(npoApplicationId).catch((err) => console.error(err));
  return appSnapshot.data() ? appSnapshot.data() : {};
};

const NpoApplication = ({ npoApplicationId, npoApplicationDetails, user }) => {
  return (
    <SessionProvider user={user}>
      <TopNavigationBar />

      <MaxWidthContainer>
        <NpoApplicationPage npoApplicationDetails={npoApplicationDetails} npoApplicationId={npoApplicationId} />
      </MaxWidthContainer>
    </SessionProvider>
  );
};

export default NpoApplication;
