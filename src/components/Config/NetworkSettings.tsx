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

  const { sendCommand } = useBluetoothService();

  const handleGetData = async () => {
    const response = await sendCommand(CommandPrefix.GET_NETWORK);
    if (response) {
      setData(response as NetworkSettingsType);
    }
  };

  const handleSetData = async () => {
    await sendCommand(CommandPrefix.SET_NETWORK, data);
  };

  return (
    <Paper p="md">
      <Stack spacing="md">
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
        
        <Group position="apart" mt="xl">
          <Button onClick={handleGetData} variant="filled">Get Data</Button>
          <Button onClick={handleSetData} variant="filled">Set Data</Button>
        </Group>
      </Stack>
    </Paper>
  );
}