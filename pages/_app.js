import * as React from 'react';
import App from 'next/app';
import { getTokens } from '@kiwicom/orbit-components';
import { ThemeProvider, createGlobalStyle } from 'styled-components';


const GlobalStyle = createGlobalStyle`
  body {
    margin: 0 auto;
    font-family: 'Trebuchet MS';
  }

  .default-avatar {
    width: 40px;
    height: 40px;
  }

  #scrollableCategory::-webkit-scrollbar, .scrollableDonation::-webkit-scrollbar {
    display: none;
  }

  .control-dots {
    padding-inline-start: 0px; 
  }
`;

const tokens = getTokens();

class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;
    return (
      
        <ThemeProvider theme={{ orbit: tokens }}>
          <>
            <GlobalStyle />
            <Component {...pageProps} />
          </>
        </ThemeProvider>
     
    );
  }
}

export default MyApp;