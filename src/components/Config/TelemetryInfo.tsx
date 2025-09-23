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
  const [isLoading, setIsLoading] = useState(false);

  const { sendCommand } = useBluetoothService();

  const handleGetData = async () => {
    try {
      setIsLoading(true);
      const response = await sendCommand(CommandPrefix.GET_TELEMETRY);
      if (response && response.data) {
        const newData = response.data as unknown as TelemetryInfoType;
        // Validate the received data
        if (typeof newData === 'object' && 
            'project' in newData && 
            'unique_id' in newData && 
            'telemetry_id' in newData && 
            'sensor_id' in newData && 
            'current_time' in newData) {
          setData(newData);
        } else {
          console.error('Received invalid data format');
        }
      }
    } catch (error) {
      console.error('Error fetching telemetry data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetData = async () => {
    try {
      setIsLoading(true);
      await sendCommand(CommandPrefix.SET_TELEMETRY, data);
    } catch (error) {
      console.error('Error setting telemetry data:', error);
    } finally {
      setIsLoading(false);
    }
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
    </Paper>
  );
}