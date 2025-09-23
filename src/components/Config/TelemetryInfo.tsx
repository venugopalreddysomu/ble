import { TextInput, Button, Group, Paper } from '@mantine/core';
import { useState, useEffect } from 'react';
import useBluetoothService from '../../hooks/useBluetoothService';
import { CommandPrefix } from '../../utils/bluetoothCommands';
import { TelemetryInfoType } from '../../types';

export function TelemetryInfo() {
  const [data, setData] = useState<TelemetryInfoType>({
    project: '',
    unique_id: '',
    telemetry_id: '',
    sensor_id: '',
    current_time: '',
  });

  const { sendCommand } = useBluetoothService();

  const handleGetData = async () => {
    const response = await sendCommand(CommandPrefix.GET_TELEMETRY);
    if (response) {
      setData(response as TelemetryInfoType);
    }
  };

  const handleSetData = async () => {
    await sendCommand(CommandPrefix.SET_TELEMETRY, data);
  };

  return (
    <Paper p="md">
      <TextInput
        label="Project"
        value={data.project}
        onChange={(e) => setData({ ...data, project: e.target.value })}
        mb="sm"
      />
      <TextInput
        label="Unique ID"
        value={data.unique_id}
        onChange={(e) => setData({ ...data, unique_id: e.target.value })}
        mb="sm"
      />
      <TextInput
        label="Telemetry ID"
        value={data.telemetry_id}
        onChange={(e) => setData({ ...data, telemetry_id: e.target.value })}
        mb="sm"
      />
      <TextInput
        label="Sensor ID"
        value={data.sensor_id}
        onChange={(e) => setData({ ...data, sensor_id: e.target.value })}
        mb="sm"
      />
      
      <Group position="apart" mt="xl">
        <Button onClick={handleGetData} variant="filled">Get Data</Button>
        <Button onClick={handleSetData} variant="filled">Set Data</Button>
      </Group>
    </Paper>
  );
}