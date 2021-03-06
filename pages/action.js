import React from 'react';
import Error from 'next/error';
import ActionPage from '@components/action/pages/ActionPage';
import media from '@kiwicom/orbit-components/lib/utils/mediaQuery';
import styled, { css } from 'styled-components';

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
  const url = req.url;
  const { mode } = query; // signIn
  const { oobCode, apiKey, continueUrl } = query;
  let isError = true;
  if (mode && oobCode && apiKey) {
    isError = false;
  }
  return {
    props: {
      isError,
      mode: mode || null,
      oobCode: oobCode || null,
      continueUrl: continueUrl || null,
      url,
    },
  };
}

const Action = ({ isError, url, continueUrl }) => {
  if (isError) {
    return <Error statusCode={404} />;
  }
  return (
    <Wrapper>
      <Container>
        <Panel>
          <ActionPage url={url} continueUrl={continueUrl} />
        </Panel>
      </Container>
    </Wrapper>
  );
};

export default Action;
