import React from 'react';
import { isAuthenticated } from '@utils/authentication/authentication';
import SessionProvider from '@components/session/modules/SessionProvider';
import MaxWidthContainer from '@components/containers/MaxWidthContainer';
import { isAdminEditorAndAbove } from '@utils/authentication/checkAdminType';

import dynamic from 'next/dynamic';
const TopNavigationBar = dynamic(() => import('@components/navbar/modules/TopNavigationBar'), { ssr: false });
const LegalPage = dynamic(() => import('@components/legal/pages/LegalPage'), { ssr: false });

export async function getServerSideProps({ params, req, res, query }) {
  let data = await isAuthenticated(req, res, { Location: '/' });
  isAdminEditorAndAbove(data.user, res, { Location: '/dashboard' });
  return {
    props: {
      user: data.user || null,
    },
  };
}

const Legal = ({ user }) => {
  return (
    <SessionProvider user={user}>
      <TopNavigationBar />

      <MaxWidthContainer>
        <LegalPage />
      </MaxWidthContainer>
    </SessionProvider>
  );
};

export default Legal;
