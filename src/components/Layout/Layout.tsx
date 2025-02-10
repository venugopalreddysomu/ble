import { FC } from 'react';
import { AppShell } from '@mantine/core';
import HomePage from '@/pages/Home.page';
import Footer from './components/Footer';
import Header from './components/Header';

const Layout: FC<{}> = () => {
  return (
    <AppShell
      header={{ height: 60 }}
      footer={{ height: 45 }}
      padding="md"
      styles={{
        header: {
          boxShadow: '0 1px 4px 0 rgba(0,0,0,.10)',
          zIndex: 9999,
        },
        main: {
          display: 'flex',
          flexDirection: 'column',
          background: '#FCFCFC',
        },
        footer: {
          boxShadow: '0 1px 4px 0 rgba(0,0,0,.10)',
          zIndex: 10,
        },
      }}
    >
      <AppShell.Header>
        <Header />
      </AppShell.Header>
      <AppShell.Main style={{ display: 'flex', flexDirection: 'column' }}>
        <HomePage />
      </AppShell.Main>
      <AppShell.Footer>
        <Footer />
      </AppShell.Footer>
    </AppShell>
  );
};

export default Layout;
