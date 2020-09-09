import React from 'react';
import media from '@kiwicom/orbit-components/lib/utils/mediaQuery';
import styled, { css } from 'styled-components';
import LoginPage from '@components/login/pages/LoginPage';
import { isAuthenticated } from '@utils/authentication/authentication';

const Wrapper = styled.div`
  display: flex;
  box-sizing: border-box;

  ${media.largeMobile(css`
    height: 100vh;
  `)};
`;

const Container = styled.div`
  ${media.largeMobile(css`
    display: flex;
    flex: 1;
    justify-content: center;
    align-items: center;
  `)};
`;

const Panel = styled.div`
  margin-right: auto;
  margin-left: auto;
  padding-left: 12px;
  padding-right: 12px;
  min-width: 400px;
  margin-top: 50px;
  max-width: 700px;

  ${media.largeMobile(css`
    margin-top: 0px;
    width: 60%;
  `)};

  ${media.largeDesktop(css`
    width: 40%;
  `)};
`;

export async function getServerSideProps({ params, req, res, query }) {
  let data = await isAuthenticated(req, res);
  if (data) {
    res.writeHead(302, { Location: '/dashboard' });
    res.end();
  }
  return {
    props: {
      user: (data && data.user) || null,
    },
  };
}

const IndexPage = () => {
  return (
    <Wrapper>
      <Container>
        <Panel>
          <LoginPage />
        </Panel>
      </Container>
    </Wrapper>
  );
};

export default IndexPage;
