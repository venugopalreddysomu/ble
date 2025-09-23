import { FC, useState } from 'react';
import { AppShell } from '@mantine/core';
import useBluetooth from '@/hooks/useBluetooth';
import Header from './components/Header';
import { BottomNav } from './components/BottomNav';
import { ConfigTabs } from '../Config/ConfigTabs';
import Terminal from '../Terminal/Terminal';
import { LiveData } from '../Live/LiveData';
import { DisconnectedView } from '../Overlays/DisconnectedView';

const Layout: FC = () => {
  const [activeSection, setActiveSection] = useState('terminal');
  const { isConnected } = useBluetooth();

  const renderContent = () => {
    if (!isConnected) {
      return <DisconnectedView />;
    }

    switch (activeSection) {
      case 'config':
        return <ConfigTabs />;
      case 'terminal':
        return <Terminal />;
      case 'live':
        return <LiveData />;
      case 'ota':
        return <div>OTA Update Section - Coming Soon</div>;
      case 'reports':
        return <div>Reports Section - Coming Soon</div>;
      default:
        return <Terminal />;
    }
  };

  return (
    <AppShell
      header={{ height: 60 }}
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
          paddingBottom: '60px', // Space for bottom navigation
        },
      }}
    >
      <AppShell.Header>
        <Header />
      </AppShell.Header>
      <AppShell.Main>
        {renderContent()}
      </AppShell.Main>
      {isConnected && (
        <BottomNav active={activeSection} onChange={setActiveSection} />
      )}
    </AppShell>
  );
};

export default Layout;
