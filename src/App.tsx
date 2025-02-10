import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import Layout from './components/Layout/Layout';
import BluetoothProvider from './providers/BluetoothProvider';
import LoaderProvider from './providers/LoaderProvider';
import { theme } from './theme';

export default function App() {
  return (
    <BluetoothProvider>
      <MantineProvider theme={theme}>
        <LoaderProvider>
          <Layout />
        </LoaderProvider>
        <Notifications />
      </MantineProvider>
    </BluetoothProvider>
  );
}
