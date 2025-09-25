import { TextInput, Button, Group, Paper } from '@mantine/core';
import { useState, useEffect } from 'react';
import useBluetoothService from '../../hooks/useBluetoothService';
import { CommandPrefix } from '../../utils/bluetoothCommands';
import { TelemetryInfoType } from '../../types';

export function TelemetryInfo() {
  const [data, setData] = useState<TelemetryInfoType>({
    p: '',           // project
    uid: '',         // unique_id
    tid: '',         // telemetry_id
    sid: '',         // sensor_id
    t: '',           // current_time
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
            'p' in newData && 
            'uid' in newData && 
            'tid' in newData && 
            'sid' in newData && 
            't' in newData) {
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
        value={data.p}
        onChange={(e) => setData({ ...data, p: e.target.value })}
        mb="sm"
      />
      <TextInput
        label="Unique ID"
        value={data.uid}
        onChange={(e) => setData({ ...data, uid: e.target.value })}
        mb="sm"
      />
      <TextInput
        label="Telemetry ID"
        value={data.tid}
        onChange={(e) => setData({ ...data, tid: e.target.value })}
        mb="sm"
      />
      <TextInput
        label="Sensor ID"
        value={data.sid}
        onChange={(e) => setData({ ...data, sid: e.target.value })}
        mb="sm"
      />
      <TextInput
        label="Current Time"
        value={data.t}
        onChange={(e) => setData({ ...data, t: e.target.value })}
        mb="sm"
        placeholder="ISO 8601 format"
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