import { TextInput, Button, Group, Paper, Stack, SegmentedControl, Text, Box } from '@mantine/core';
import { useState, useEffect } from 'react';
import useBluetoothService from '../../hooks/useBluetoothService';
import { CommandPrefix } from '../../utils/bluetoothCommands';
import { AdvancedSettingsType } from '../../types';

interface AdvancedSettingsProps {
  isActive: boolean;
}

export function AdvancedSettings({ isActive }: AdvancedSettingsProps) {
  const [data, setData] = useState<AdvancedSettingsType>({
    pname: '',         // project_name
    alarms: '',        // alarm times
    mhost: '',         // MQTT host
    mqttu: '',         // MQTT username
    mqttp: ''          // MQTT password
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

  // Auto-load data when component mounts
  useEffect(() => {
    if (isActive) {
      handleGetData();
    }
  }, [isActive]);

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
          placeholder="e.g., apwrims.ap.gov.in"
        />
        
        {/*intentionally disabled mqtt creds for now.*/
        /* <TextInput
          label="MQTT Username"
          description="Username for MQTT authentication"
          value={data.mqttu}
          onChange={(e) => setData({ ...data, mqttu: e.target.value })}
          placeholder="e.g., apwrims"
        />
        
        <TextInput
          label="MQTT Password"
          description="Password for MQTT authentication"
          type="password"
          value={data.mqttp}
          onChange={(e) => setData({ ...data, mqttp: e.target.value })}
          placeholder="Enter MQTT password"
        /> */}

        <Box>
          <Text size="sm" fw={500} mb="xs">Operation Mode</Text>
          <Text size="xs" c="dimmed" mb="xs">Click to switch device operation mode</Text>
          <Group grow>
            <Button
              variant={opmode === 'normal' ? 'filled' : 'light'}
              color="green"
              onClick={() => handleOpmodeChange('normal')}
              loading={isLoading}
              disabled={isLoading}
            >
              Normal Mode
            </Button>
            <Button
              variant={opmode === 'storage' ? 'filled' : 'light'}
              color="orange"
              onClick={() => handleOpmodeChange('storage')}
              loading={isLoading}
              disabled={isLoading}
            >
              Storage Mode
            </Button>
          </Group>
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
