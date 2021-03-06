import * as React from 'react';
import App from 'next/app';
import { getTokens } from '@kiwicom/orbit-components';
import { ThemeProvider, createGlobalStyle } from 'styled-components';

import { Provider } from 'react-redux';
import { createWrapper } from 'next-redux-wrapper';
import store from '../store';
import 'react-toastify/dist/ReactToastify.css';
import 'react-quill/dist/quill.snow.css';
import 'react-datepicker/dist/react-datepicker.css';

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

  .ql-editor li {
    padding-bottom: 15px;
  }

  .react-datepicker-popper {
    z-index: 3;
  }
`;

const tokens = getTokens();

class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;
    return (
      <Provider store={store}>
        <ThemeProvider theme={{ orbit: tokens }}>
          <>
            <GlobalStyle />
            <Component {...pageProps} />
          </>
        </ThemeProvider>
      </Provider>
    );
  }
}

const makeStore = () => store;
const wrapper = createWrapper(makeStore);

export default wrapper.withRedux(MyApp);
