import { Paper, Text, Grid, Badge, Group, Box, Title, ActionIcon, Modal, TextInput, Button } from '@mantine/core';
import { useState, useEffect } from 'react';
import { IconEdit, IconRefresh } from '@tabler/icons-react';
import useBluetoothService from '../../hooks/useBluetoothService';
import { CommandPrefix } from '../../utils/bluetoothCommands';
import { DeviceInfoType } from '../../types';

export function DeviceInfo() {
  const [data, setData] = useState<DeviceInfoType>({
    firmware_version: 0,
    bt_mac: '',
    sensor_serial: 0,
    project_name: '',
    mhost: '',
    devTime: '',
    opmode: '',
    btname: '',
    alarms: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [editNameModal, setEditNameModal] = useState(false);
  const [newDeviceName, setNewDeviceName] = useState('');

  const { sendCommand } = useBluetoothService();

  const handleGetDeviceInfo = async () => {
    try {
      setIsLoading(true);
      const response = await sendCommand<DeviceInfoType>(CommandPrefix.GET_DEVINFO);
      if (response && response.success && response.data) {
        setData(response.data);
        setNewDeviceName(response.data.btname);
      }
    } catch (error) {
      console.error('Error fetching device info:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetDeviceName = async () => {
    try {
      setIsLoading(true);
      await sendCommand(CommandPrefix.SET_DEVNAME, newDeviceName);
      setEditNameModal(false);
      // Refresh device info after setting name
      setTimeout(() => handleGetDeviceInfo(), 500);
    } catch (error) {
      console.error('Error setting device name:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch device info on component mount
  useEffect(() => {
    handleGetDeviceInfo();
  }, []);

  const InfoCard = ({ label, value, color }: { label: string; value: string | number; color?: string }) => (
    <Paper p="sm" withBorder style={{ height: '100%' }}>
      <Text size="xs" c="dimmed" mb={4}>{label}</Text>
      <Text size="md" fw={600} c={color}>{value}</Text>
    </Paper>
  );

  return (
    <Box style={{ maxWidth: 900, margin: '0 auto', padding: '1rem' }}>
      <Paper shadow="md" p="lg" radius="md">
        <Group justify="space-between" mb="lg">
          <Group>
            <Title order={3}>Device Information</Title>
            <ActionIcon 
              variant="light" 
              color="blue" 
              onClick={handleGetDeviceInfo}
              loading={isLoading}
            >
              <IconRefresh size={18} />
            </ActionIcon>
          </Group>
          <Badge 
            size="lg" 
            color={data.opmode === 'NORMAL' ? 'green' : 'orange'}
            variant="filled"
          >
            {data.opmode || 'Unknown'}
          </Badge>
        </Group>

        <Grid gutter="md">
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <Paper p="sm" withBorder style={{ height: '100%', cursor: 'pointer' }} onClick={() => setEditNameModal(true)}>
              <Group justify="space-between">
                <Box>
                  <Text size="xs" c="dimmed" mb={4}>Device Name</Text>
                  <Text size="md" fw={600}>{data.btname || 'Unknown'}</Text>
                </Box>
                <ActionIcon variant="light" color="blue" size="sm">
                  <IconEdit size={16} />
                </ActionIcon>
              </Group>
            </Paper>
          </Grid.Col>

          <Grid.Col span={{ base: 12, sm: 6 }}>
            <InfoCard label="Firmware Version" value={`v${data.firmware_version}`} color="blue" />
          </Grid.Col>

          <Grid.Col span={{ base: 12, sm: 6 }}>
            <InfoCard label="Bluetooth MAC" value={data.bt_mac || 'N/A'} />
          </Grid.Col>

          <Grid.Col span={{ base: 12, sm: 6 }}>
            <InfoCard label="Sensor Serial" value={data.sensor_serial || 'N/A'} />
          </Grid.Col>

          <Grid.Col span={{ base: 12, sm: 6 }}>
            <InfoCard label="Project Name" value={data.project_name || 'N/A'} />
          </Grid.Col>

          <Grid.Col span={{ base: 12, sm: 6 }}>
            <InfoCard label="Server Host" value={data.mhost || 'N/A'} />
          </Grid.Col>

          <Grid.Col span={12}>
            <InfoCard label="Device Time" value={data.devTime || 'N/A'} />
          </Grid.Col>

          <Grid.Col span={12}>
            <Paper p="sm" withBorder>
              <Text size="xs" c="dimmed" mb={4}>Alarm Times</Text>
              <Group gap="xs">
                {data.alarms ? data.alarms.split(',').map((alarm, idx) => (
                  <Badge key={idx} variant="light" size="lg">
                    {alarm.trim()}
                  </Badge>
                )) : <Text c="dimmed" size="sm">No alarms set</Text>}
              </Group>
            </Paper>
          </Grid.Col>
        </Grid>
      </Paper>

      {/* Edit Device Name Modal */}
      <Modal
        opened={editNameModal}
        onClose={() => setEditNameModal(false)}
        title="Edit Device Name"
        centered
      >
        <TextInput
          label="Device Name"
          placeholder="Enter device name (e.g., BT_10001)"
          value={newDeviceName}
          onChange={(e) => setNewDeviceName(e.target.value)}
          mb="md"
        />
        <Group justify="flex-end">
          <Button variant="light" onClick={() => setEditNameModal(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSetDeviceName}
            loading={isLoading}
            disabled={!newDeviceName.trim()}
          >
            Send
          </Button>
        </Group>
      </Modal>
    </Box>
  );
}
