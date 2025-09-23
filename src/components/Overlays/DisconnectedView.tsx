import { Box, Text, Group, Center } from '@mantine/core';
import { IconPlugConnectedX } from '@tabler/icons-react';

export function DisconnectedView() {
  return (
    <Center style={{ height: '100%', margin: '0 auto', padding: '0 2rem' }}>
      <Box style={{ textAlign: 'center' }}>
        <Box
          style={{
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            backgroundColor: '#e7f5ff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 2rem auto',
          }}
        >
          <IconPlugConnectedX size={60} style={{ color: '#228be6' }} />
        </Box>
        <Text style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>
          Device is not connected
        </Text>
        <Text style={{ color: '#868e96' }}>
          Please click on the CONNECT button to select and pair a Bluetooth device.
        </Text>
      </Box>
    </Center>
  );
}