import React from 'react';
import styled from 'styled-components';
import { colors } from '@constants/colors';
import { Stack, TextLink, Separator } from '@kiwicom/orbit-components/lib';

const unselectedTab = styled.a`
  color: ${colors.subtleGrey};
  text-decoration: none;

  :hover {
    text-decoration: underline;
  }
`;

const selectedTab = styled.a`
  color: ${colors.adminSelectedTabBackground};
  text-decoration: underline;

  :hover {
    text-decoration: none;
  }
`;

const Tabs = ({ isNewAcc, setIsNewAcc }) => {
  return (
    <Stack>
      <Separator />
      <Stack direction="row" spacing="extraLoose" align="center" justify="center" shrink>
        <TextLink
          type="secondary"
          asComponent={isNewAcc ? selectedTab : unselectedTab}
          onClick={() => setIsNewAcc(true)}
        >
          New Account
        </TextLink>
        <TextLink
          type="secondary"
          asComponent={isNewAcc ? unselectedTab : selectedTab}
          onClick={() => setIsNewAcc(false)}
        >
          Existing Account
        </TextLink>
      </Stack>
      <Separator />
    </Stack>
  );
};

export default Tabs;
