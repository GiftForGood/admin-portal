import React from 'react';
import { Stack, ButtonLink, Popover } from '@kiwicom/orbit-components/';
import { MenuHamburger } from '@kiwicom/orbit-components/lib/icons';
import useMediaQuery from '@kiwicom/orbit-components/lib/hooks/useMediaQuery';
import LogoButton from '@components/buttons/LogoButton';
import { companyLogoImagePath } from '@constants/imagePaths';
import styled from 'styled-components';
import Link from 'next/link';

const TopLeftNavigation = ({ onHamburgerClick }) => {
  const { isDesktop } = useMediaQuery();
  return (
    <Stack direction="row" shrink spacing="tight">
      {isDesktop ? (
        <>
          <LogoButton src={companyLogoImagePath} height={45} href={'/dashboard'} />

          <Link href="/">
            <ButtonLink transparent type="secondary" href={'/dashboard'}>
              Dashboard
            </ButtonLink>
          </Link>

          <Link href="/npo-applications">
            <ButtonLink transparent type="secondary" href={'/npo-applications'}>
              NPO Applications
            </ButtonLink>
          </Link>

          <Link href="/npo-organizations">
            <ButtonLink transparent type="secondary" href={'/npo-organizations'}>
              NPO Organizations
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

          <Link href="/legal">
            <ButtonLink transparent type="secondary" href={'/legal'}>
              Legal
            </ButtonLink>
          </Link>

          <Popover
            content={
              <Stack direction="column" spacing="extraTight">
                <ButtonLink transparent type="secondary" href="/admins">
                  Admins
                </ButtonLink>
                <ButtonLink transparent type="secondary" href="/donors">
                  Donors
                </ButtonLink>
                <ButtonLink transparent type="secondary" href="/npos">
                  NPOs
                </ButtonLink>
              </Stack>
            }
            preferredAlign="end"
          >
            <ButtonLink transparent type="secondary">
              Users
            </ButtonLink>
          </Popover>
        </>
      ) : (
        <ButtonLink iconLeft={<MenuHamburger />} transparent type="secondary" onClick={onHamburgerClick} />
      )}
    </Stack>
  );
};

export default TopLeftNavigation;
