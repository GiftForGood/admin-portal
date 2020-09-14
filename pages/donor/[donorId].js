import React from 'react';
import { isAuthenticated } from '@utils/authentication/authentication';
import SessionProvider from '@components/session/modules/SessionProvider';
import MaxWidthContainer from '@components/containers/MaxWidthContainer';
import DonorPage from '@components/donor/pages/DonorPage';

import dynamic from 'next/dynamic';
const TopNavigationBar = dynamic(() => import('@components/navbar/modules/TopNavigationBar'), { ssr: false });

export async function getServerSideProps({ params, req, res, query }) {
  const donorId = params.donorId;
  const data = await isAuthenticated(req, res, { Location: '/' });
  return {
    props: {
      donorId,
      user: data.user || null,
    },
  };
}

const Donor = ({ donorId, user }) => {
  return (
    <SessionProvider user={user}>
      <TopNavigationBar />
      <MaxWidthContainer>
        <DonorPage donorId={donorId} />
      </MaxWidthContainer>
    </SessionProvider>
  );
};

export default Donor;
