import React, { useEffect, useState } from 'react';
import api from '../../../../api';
import { BASE_URL } from '../../../../utils/constants/siteUrl';
import Error from 'next/error';
import useLocalStorage from '../../../../utils/hooks/useLocalStorage';
import { Loading } from '@kiwicom/orbit-components';
import { useRouter } from 'next/router';
import client from '../../../../utils/axios';

const ActionPage = ({ url, continueUrl }) => {
  const [isError, setIsError] = useState(false);
  const [emailLocalStorage, setEmailLocalStorage] = useLocalStorage('email', '');
  const router = useRouter();

  const signIn = async () => {
    const isSignInWithEmailLink = await api.auth.isSignInWithEmailLink(url);
    if (isSignInWithEmailLink) {
      let email = emailLocalStorage;
      if (emailLocalStorage === '') {
        email = window.prompt('Please provide your email for confirmation');
      }
      try {
        const [token, userProfile, userDoc] = await api.auth.signInWithEmailLink(email, BASE_URL + url);
        if (!userProfile.emailVerified) {
          throw Error('Not Verified');
        }
        let response = await client.post('/api/sessionLogin', { token });
        if (response.status === 200) {
          router.push('/');
        } else {
          console.error(response.error);
          throw response.error;
        }
        setEmailLocalStorage(''); // clear email from storage
        router.replace('/dashboard');
      } catch (error) {
        setIsError(true);
      }
    } else {
      setIsError(true);
    }
  };

  useEffect(() => {
    if (url && continueUrl) {
      signIn();
    }
  }, []);

  if (isError) {
    return <Error statusCode={401} />;
  }

  return <Loading loading text="Please wait, while we check your login..." type="pageLoader" />;
};

export default ActionPage;
