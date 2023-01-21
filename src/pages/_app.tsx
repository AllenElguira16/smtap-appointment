import '../styles/globals.css';
import 'material-icons/iconfont/material-icons.css';
import NextNProgress from 'nextjs-progressbar';
import type { AppProps } from 'next/app';
import { RecoilRoot } from 'recoil';
import { trpc } from '@/utils';
import { Alert } from '@/components';
import { useEffect } from 'react';

function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    document
      .querySelector('html')
      ?.setAttribute(
        'data-theme',
        window.localStorage.getItem('app-color') || 'light',
      );
  }, []);

  return (
    <RecoilRoot>
      <NextNProgress />
      <Component {...pageProps} />
      <Alert />
    </RecoilRoot>
  );
}

export default trpc.withTRPC(App);
