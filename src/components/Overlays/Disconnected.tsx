import { FC } from 'react';
import { IconBluetoothOff } from '@tabler/icons-react';
import { Box, Card, Group, Text } from '@mantine/core';

const Disconnected: FC<{}> = () => {
  return (
    <Card
      shadow="sm"
      padding="xl"
      component="a"
      style={{ zIndex: 7, margin: 15, maxWidth: '600px' }}
    >
      <Group justify="center" gap={20}>
        <IconBluetoothOff color="red" size={50} stroke={1} />
        <Box>
          <Text fw={500} size="lg">
            Device is not connected
          </Text>

          <Text mt="xs" c="dimmed" size="sm">
            Please click on the CONNECT button to select and pair a Bluetooth device.
          </Text>
        </Box>
      </Group>
    </Card>
  );
};

export default Disconnected;
