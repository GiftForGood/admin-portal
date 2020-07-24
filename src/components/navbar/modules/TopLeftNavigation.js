import React from 'react';
import { Stack, ButtonLink } from '@kiwicom/orbit-components/';
import { MenuHamburger } from '@kiwicom/orbit-components/lib/icons';
import useMediaQuery from '@kiwicom/orbit-components/lib/hooks/useMediaQuery';
import LogoButton from '../../buttons/LogoButton';
import { companyLogoImagePath } from '../../../../utils/constants/imagePaths';
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
        </>
      ) : (
        <ButtonLink iconLeft={<MenuHamburger />} transparent type="secondary" onClick={onHamburgerClick} />
      )}
    </Stack>
  );
};

export default TopLeftNavigation;
