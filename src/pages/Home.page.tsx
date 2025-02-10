import { FC } from 'react';
import { LoadingOverlay, ScrollArea, Stack, useMatches } from '@mantine/core';
import Applications from '@/components/Overlays/Applications';
import BrowserNotSupported from '@/components/Overlays/BrowserNotSupported';
import Disconnected from '@/components/Overlays/Disconnected';
import Terminal from '@/components/Terminal/Terminal';
import useBluetooth from '@/hooks/useBluetooth';
import useLoader from '@/hooks/useLoader';

const HomePage: FC<{}> = () => {
  const bluetooth = useBluetooth();
  const loader = useLoader();
  const isBrowserSupported = bluetooth.isSupported;
  const isDisconnected = !bluetooth.isConnected && !bluetooth.isConnecting && isBrowserSupported;
  const isLoader =
    (bluetooth.isConnecting || (loader.isLoading && !isDisconnected)) && isBrowserSupported;

  const scrollStyle = useMatches({
    base: {
      height: 'calc(100vh - var(--app-shell-header-height) - var(--app-shell-footer-height) - 75px)',
      marginTop: '15px',
    },
    md: undefined,
  });

  return (
    <>
      <LoadingOverlay
        visible={!isBrowserSupported || isDisconnected || isLoader}
        zIndex={5}
        style={{ position: 'fixed' }}
        overlayProps={{ radius: 'sm', blur: 5, backgroundOpacity: 0.02, color: 'black' }}
        loaderProps={
          isLoader
            ? { color: 'blue', type: 'bars' }
            : {
                children: (
                  <ScrollArea style={scrollStyle} type="auto">
                    <Stack align="center" justify="center" gap="sm">
                      {!isBrowserSupported && <BrowserNotSupported />}
                      {isDisconnected && <Disconnected />}
                      <Applications />
                    </Stack>
                  </ScrollArea>
                ),
              }
        }
      />
      <Terminal />
    </>
  );
};

export default HomePage;
