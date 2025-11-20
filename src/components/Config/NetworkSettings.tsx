import { TextInput, Switch, Button, Group, Paper, Stack, NumberInput } from '@mantine/core';
import { useState, useEffect } from 'react';
import useBluetoothService from '../../hooks/useBluetoothService';
import { CommandPrefix } from '../../utils/bluetoothCommands';
import { NetworkSettingsType } from '../../types';

interface NetworkSettingsProps {
  isActive: boolean;
}

export function NetworkSettings({ isActive }: NetworkSettingsProps) {
  const [data, setData] = useState<NetworkSettingsType>({
    apn: '',          // apn
    am: false,        // auto_mode
    f4g: false,       // force_4g_only
    dlo: false,       // data_logging_only
    e6: false,        // enable_ipv6
    msig: 0           // minimum_signal_level
  });
  const [isLoading, setIsLoading] = useState(false);

  const { sendCommand } = useBluetoothService();

  const handleGetData = async () => {
    try {
      setIsLoading(true);
      const response = await sendCommand<NetworkSettingsType>(CommandPrefix.GET_NETWORK);
      if (response && response.success && response.data) {
        setData(response.data);
      }
    } catch (error) {
      console.error('Error fetching network data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetData = async () => {
    try {
      setIsLoading(true);
      await sendCommand(CommandPrefix.SET_NETWORK, data);
    } catch (error) {
      console.error('Error setting network data:', error);
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
      <Stack>
        <TextInput
          label="APN"
          description="Access Point Name for cellular data connection"
          value={data.apn}
          onChange={(e) => setData({ ...data, apn: e.target.value })}
          placeholder="e.g., internet, airtelgprs.com"
        />
        <NumberInput
          label="Minimum Signal Level"
          description="Minimum signal strength required for data transmission"
          value={data.msig}
          onChange={(value) => setData({ ...data, msig: typeof value === 'number' ? value : 10 })}
          min={0}
          max={31}
        />
        <Switch
          label="Auto Mode"
          description="Enable automatic network mode selection"
          checked={data.am}
          onChange={(e) => setData({ ...data, am: e.target.checked })}
        />
        <Switch
          label="Force 4G Only"
          description="Force device to use 4G/LTE network only"
          checked={data.f4g}
          onChange={(e) => setData({ ...data, f4g: e.target.checked })}
        />
        <Switch
          label="Data Logging Only"
          description="Store data locally without transmitting"
          checked={data.dlo}
          onChange={(e) => setData({ ...data, dlo: e.target.checked })}
        />
        <Switch
          label="Enable IPv6"
          description="Enable IPv6 protocol support"
          checked={data.e6}
          onChange={(e) => setData({ ...data, e6: e.target.checked })}
        />
        
        <Group style={{ justifyContent: 'space-between', marginTop: '2rem' }}>
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