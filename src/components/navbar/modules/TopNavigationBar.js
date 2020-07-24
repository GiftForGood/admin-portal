import React, { useState, useEffect, useCallback } from 'react';
import { Stack, ButtonLink, NavigationBar, Separator, NavigationDrawer } from '@kiwicom/orbit-components';
import TopLeftNavigation from './TopLeftNavigation';
import TopRightNavigation from './TopRightNavigation';
import styled, { css } from 'styled-components';
import media from '@kiwicom/orbit-components/lib/utils/mediaQuery';
import { EMAIL_BAR_HEIGHT, NAVBAR_HEIGHT } from '../../../../utils/constants/navbar';
import useUser from '../../session/modules/useUser';
import transition from '@kiwicom/orbit-components/lib/utils/transition';
import Link from 'next/link';

const TopNavigationBarContainer = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  flex-direction: column;
  width: 100%;
  display: flex;
  box-sizing: border-box;
  z-index: 100;
  transition: ${transition(['transform'], 'normal', 'ease-in-out')};
  transform: translate3d(0, ${({ shown }) => (shown ? '0' : `-100px`)}, 0);

  ${media.tablet(css`
    transform: translate3d(0, ${({ shown }) => (shown ? '0' : `-100px`)}, 0);
  `)};
`;

const NavigationBarContainer = styled.div`
  background: ${({ theme }) => theme.orbit.paletteWhite};
  box-shadow: ${({ theme }) => theme.orbit.boxShadowFixed};
  display: flex;
  flex-flow: row nowrap;
  padding-left: 12px;
  padding-right: 20px;
  padding-top: 4px;
  padding-bottom: 4px;

  ${media.largeMobile(css`
    padding-top: 10px;
    padding-bottom: 10px;
  `)};
`;

// Used to push content downwards.
const FakeContainer = styled.div`
  display: flex;
  height: ${(props) =>
    props.user
      ? props.user.emailVerified
        ? NAVBAR_HEIGHT.MOBILE
        : NAVBAR_HEIGHT.MOBILE + EMAIL_BAR_HEIGHT.MOBILE
      : NAVBAR_HEIGHT.MOBILE}px;

  ${media.largeMobile(css`
    height: ${(props) =>
      props.user
        ? props.user.emailVerified
          ? NAVBAR_HEIGHT.DESKTOP
          : NAVBAR_HEIGHT.DESKTOP + EMAIL_BAR_HEIGHT.DESKTOP
        : NAVBAR_HEIGHT.DESKTOP}px;
  `)};
`;

const TopNavigationBar = () => {
  const user = useUser();
  const [showDrawer, setShowDrawer] = useState(false);
  const [shown, setShown] = useState(true);
  const [prevScrollPosition, setPrevScrollPosition] = useState(0);

  const onHamburgerClick = () => {
    setShowDrawer(true);
  };

  const onHamburgerClose = () => {
    setShowDrawer(false);
  };

  const handleNavigationBarPosition = useCallback(() => {
    const currentScrollPosition =
      window.scrollY || window.pageYOffset || (document.documentElement && document.documentElement.scrollTop);

    if (prevScrollPosition < currentScrollPosition && currentScrollPosition > NAVBAR_HEIGHT.DESKTOP) {
      setShown(false);
    } else {
      setShown(true);
    }

    setPrevScrollPosition(currentScrollPosition);
  }, [prevScrollPosition, setShown]);

  useEffect(() => {
    window.addEventListener('scroll', handleNavigationBarPosition);
    return () => {
      window.removeEventListener('scroll', handleNavigationBarPosition);
    };
  });

  return (
    <>
      <TopNavigationBarContainer shown={shown}>
        <NavigationBarContainer>
          <Stack justify="between" spacing="none">
            <TopLeftNavigation onHamburgerClick={onHamburgerClick} />
            <TopRightNavigation />
          </Stack>
        </NavigationBarContainer>
      </TopNavigationBarContainer>

      <FakeContainer user={user} />

      <NavigationDrawer shown={showDrawer} position="left" onClose={onHamburgerClose} suppressed={false}>
        <Stack direction="column">
          <Stack direction="column" spacing="tight">
            <Link href="/">
              <ButtonLink transparent type="secondary" href={'/'}>
                Dashboard
              </ButtonLink>
            </Link>

            <Link href="/npo-applications">
              <ButtonLink transparent type="secondary" href={'/npo-applications'}>
                NPO Applications
              </ButtonLink>
            </Link>

            <Link href="/npos">
              <ButtonLink transparent type="secondary" href={'/npos'}>
                NPOs
              </ButtonLink>
            </Link>

            <Link href="/donors">
              <ButtonLink transparent type="secondary" href={'/donors'}>
                Donors
              </ButtonLink>
            </Link>

            <Link href="/admins">
              <ButtonLink transparent type="secondary" href={'/admins'}>
                Admins
              </ButtonLink>
            </Link>

            <Link href="/categories">
              <ButtonLink transparent type="secondary" href={'/categories'}>
                Categories
              </ButtonLink>
            </Link>

            <Link href="/banner">
              <ButtonLink transparent type="secondary" href={'/banner'}>
                Banner
              </ButtonLink>
            </Link>
          </Stack>
        </Stack>
      </NavigationDrawer>
    </>
  );
};

export default TopNavigationBar;
