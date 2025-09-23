import { TextInput, Switch, Button, Group, Paper, Stack } from '@mantine/core';
import { useState } from 'react';
import useBluetoothService from '../../hooks/useBluetoothService';
import { CommandPrefix } from '../../utils/bluetoothCommands';
import { NetworkSettingsType } from '../../types';

export function NetworkSettings() {
  const [data, setData] = useState<NetworkSettingsType>({
    apn: '',
    mobile_number: '',
    auto_mode: true,
    force_4g_only: false,
    data_logging_only: false,
    enable_ipv6: false,
    onomondo_sim: false
  });
  const [isLoading, setIsLoading] = useState(false);

  const { sendCommand } = useBluetoothService();

  const handleGetData = async () => {
    try {
      setIsLoading(true);
      const response = await sendCommand(CommandPrefix.GET_NETWORK);
      if (response && response.data) {
        const newData = response.data as unknown as NetworkSettingsType;
        // Validate the received data
        if (typeof newData === 'object' && 
            'apn' in newData && 
            'mobile_number' in newData && 
            'auto_mode' in newData && 
            'force_4g_only' in newData && 
            'data_logging_only' in newData && 
            'enable_ipv6' in newData && 
            'onomondo_sim' in newData) {
          setData(newData);
        } else {
          console.error('Received invalid data format');
        }
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

  return (
    <Paper p="md">
      <Stack>
        <TextInput
          label="APN"
          value={data.apn}
          onChange={(e) => setData({ ...data, apn: e.target.value })}
        />
        <TextInput
          label="Mobile Number"
          value={data.mobile_number}
          onChange={(e) => setData({ ...data, mobile_number: e.target.value })}
        />
        <Switch
          label="Auto Mode"
          checked={data.auto_mode}
          onChange={(e) => setData({ ...data, auto_mode: e.target.checked })}
        />
        <Switch
          label="Force 4G Only"
          checked={data.force_4g_only}
          onChange={(e) => setData({ ...data, force_4g_only: e.target.checked })}
        />
        <Switch
          label="Data Logging Only"
          checked={data.data_logging_only}
          onChange={(e) => setData({ ...data, data_logging_only: e.target.checked })}
        />
        <Switch
          label="Enable IPv6"
          checked={data.enable_ipv6}
          onChange={(e) => setData({ ...data, enable_ipv6: e.target.checked })}
        />
        <Switch
          label="Onomondo SIM"
          checked={data.onomondo_sim}
          onChange={(e) => setData({ ...data, onomondo_sim: e.target.checked })}
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