import { TextInput, Switch, Button, Group, Paper, Stack } from '@mantine/core';
import { useState } from 'react';
import useBluetoothService from '../../hooks/useBluetoothService';
import { CommandPrefix } from '../../utils/bluetoothCommands';
import { NetworkSettingsType } from '../../types';

export function NetworkSettings() {
  const [data, setData] = useState<NetworkSettingsType>({
    apn: '',         // apn
    mob: '',         // mobile_number
    am: true,        // auto_mode
    f4g: false,      // force_4g_only
    dlo: false,      // data_logging_only
    e6: false,       // enable_ipv6
    os: false        // onomondo_sim
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
            'mob' in newData && 
            'am' in newData && 
            'f4g' in newData && 
            'dlo' in newData && 
            'e6' in newData && 
            'os' in newData) {
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
          value={data.mob}
          onChange={(e) => setData({ ...data, mob: e.target.value })}
          placeholder="+919876543210"
        />
        <Switch
          label="Auto Mode"
          checked={data.am}
          onChange={(e) => setData({ ...data, am: e.target.checked })}
        />
        <Switch
          label="Force 4G Only"
          checked={data.f4g}
          onChange={(e) => setData({ ...data, f4g: e.target.checked })}
        />
        <Switch
          label="Data Logging Only"
          checked={data.dlo}
          onChange={(e) => setData({ ...data, dlo: e.target.checked })}
        />
        <Switch
          label="Enable IPv6"
          checked={data.e6}
          onChange={(e) => setData({ ...data, e6: e.target.checked })}
        />
        <Switch
          label="Onomondo SIM"
          checked={data.os}
          onChange={(e) => setData({ ...data, os: e.target.checked })}
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