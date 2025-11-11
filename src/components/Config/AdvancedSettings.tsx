import { TextInput, Button, Group, Paper, Stack, SegmentedControl, Text, Box } from '@mantine/core';
import { useState } from 'react';
import useBluetoothService from '../../hooks/useBluetoothService';
import { CommandPrefix } from '../../utils/bluetoothCommands';
import { AdvancedSettingsType } from '../../types';

export function AdvancedSettings() {
  const [data, setData] = useState<AdvancedSettingsType>({
    pname: 'AP_PCB',   // project_name
    alarms: '00:00,08:00,16:00,21:00',  // alarm times
    mhost: 'dashboard.bridgethings.com' // MQTT host
  });
  const [opmode, setOpmode] = useState<string>('normal');
  const [isLoading, setIsLoading] = useState(false);

  const { sendCommand } = useBluetoothService();

  const handleGetData = async () => {
    try {
      setIsLoading(true);
      const response = await sendCommand<AdvancedSettingsType>(CommandPrefix.GET_ADVANCED);
      if (response && response.success && response.data) {
        setData(response.data);
      }
    } catch (error) {
      console.error('Error fetching advanced settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetData = async () => {
    try {
      setIsLoading(true);
      await sendCommand(CommandPrefix.SET_ADVANCED, data);
    } catch (error) {
      console.error('Error setting advanced settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpmodeChange = async (value: string) => {
    setOpmode(value);
    try {
      setIsLoading(true);
      const command = value === 'normal' ? CommandPrefix.OPMODE_NORMAL : CommandPrefix.OPMODE_STORAGE;
      await sendCommand(command);
    } catch (error) {
      console.error('Error changing operation mode:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Paper p="md">
      <Stack gap="md">
        <TextInput
          label="Project Name"
          description="Name of the project or deployment"
          value={data.pname}
          onChange={(e) => setData({ ...data, pname: e.target.value })}
          placeholder="e.g., AP_PCB, AP_DWLR"
        />
        
        <TextInput
          label="Alarm Times"
          description="Comma-separated alarm times in HH:MM format"
          value={data.alarms}
          onChange={(e) => setData({ ...data, alarms: e.target.value })}
          placeholder="e.g., 00:00,08:00,16:00,21:00"
        />
        
        <TextInput
          label="Server Host"
          description="server hostname or IP address"
          value={data.mhost}
          onChange={(e) => setData({ ...data, mhost: e.target.value })}
          placeholder="e.g., dashboard.bridgethings.com"
        />

        <Box>
          <Text size="sm" fw={500} mb="xs">Operation Mode</Text>
          <Text size="xs" c="dimmed" mb="xs">Select the device operation mode</Text>
          <SegmentedControl
            value={opmode}
            onChange={handleOpmodeChange}
            data={[
              { label: 'Normal Mode', value: 'normal' },
              { label: 'Storage Mode', value: 'storage' }
            ]}
            fullWidth
            disabled={isLoading}
          />
        </Box>
        
        <Group justify="space-between" mt="lg">
          <Button 
            onClick={handleGetData} 
            variant="filled"
            loading={isLoading}
            disabled={isLoading}
          >
            {isLoading ? 'Getting Data...' : 'Get Data'}
          </Button>
          <Button 
            onClick={handleSetData} 
            variant="filled"
            loading={isLoading}
            disabled={isLoading}
          >
            {isLoading ? 'Setting Data...' : 'Set Data'}
          </Button>
        </Group>
      </Stack>
    </Paper>
  );
}
