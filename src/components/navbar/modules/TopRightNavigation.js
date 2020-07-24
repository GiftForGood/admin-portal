import React from 'react';
import { Stack, ButtonLink, Popover } from '@kiwicom/orbit-components/';
import useUser from '../../session/modules/useUser';
import { AccountCircle } from '@kiwicom/orbit-components/lib/icons';
import { useRouter } from 'next/router';
import api from '../../../../api';
import { client } from '../../../../utils/axios';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { logout } from '../../session/actions';

const AccountButton = ({ onLogoutClick }) => {
  return (
    <Popover
      content={
        <Stack direction="column" spacing="extraTight">
          <ButtonLink transparent type="secondary" href="/settings/profile">
            Settings
          </ButtonLink>
          <ButtonLink transparent type="secondary" onClick={onLogoutClick}>
            Logout
          </ButtonLink>
        </Stack>
      }
      preferredAlign="end"
    >
      <ButtonLink iconLeft={<AccountCircle />} transparent type="secondary" />
    </Popover>
  );
};

const LoggedInButtons = () => {
  const user = useUser();
  const router = useRouter();
  const dispatch = useDispatch();

  const onLogoutClick = async () => {
    try {
      await api.auth.logout();
      let response = await client.post('/api/sessionLogout');
      if (response.status === 200) {
        dispatch(logout());
        router.push('/');
      } else {
        throw response.error;
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Stack direction="row" justify="end" align="center" shrink spacing="extraTight">
        <AccountButton onLogoutClick={onLogoutClick} user={user} />
      </Stack>
    </>
  );
};

const TopRightNavigation = () => {
  const user = useUser();
  return (
    <>
      <Stack direction="row" justify="end" align="center" shrink spacing="extraTight">
        {user ? <LoggedInButtons /> : null}
      </Stack>
    </>
  );
};

export default TopRightNavigation;
