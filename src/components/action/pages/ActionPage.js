import React, { useEffect, useState } from 'react';
import api from '../../../../api';
import { BASE_URL } from '../../../../utils/constants/siteUrl';
import Error from 'next/error';
import useLocalStorage from '../../../../utils/hooks/useLocalStorage';
import { Loading } from '@kiwicom/orbit-components';
import { useRouter } from 'next/router';

const ActionPage = ({ url, continueUrl }) => {
	const [isError, setIsError] = useState(false);
	const [emailLocalStorage, setEmailLocalStorage] = useLocalStorage('email', '');
	const router = useRouter();

	useEffect(() => {
		if (url && continueUrl) {
			if (api.auth.isSignInWithEmailLink(BASE_URL + url)) {
				let email = emailLocalStorage;
				if (emailLocalStorage === '') {
					email = window.prompt('Please provide your email for confirmation');
				}
				api.auth
					.signInWithEmailLink(email, BASE_URL + url)
					.then((response) => {
						setEmailLocalStorage(''); // clear email from storage
						router.replace('/dashboard');
					})
					.catch((error) => {
						setIsError(true);
					});
			} else {
				setIsError(true);
			}
		}
	}, []);

	if (isError) {
		return <Error statusCode={401} />;
	}

	return <Loading loading text="Please wait, while we check your login..." type="pageLoader" />;
};

export default ActionPage;
