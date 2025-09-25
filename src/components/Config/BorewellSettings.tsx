import { NumberInput, TextInput, Button, Group, Paper } from '@mantine/core';
import { useState } from 'react';
import useBluetoothService from '../../hooks/useBluetoothService';
import { CommandPrefix } from '../../utils/bluetoothCommands';
import { BorewellSettingsType } from '../../types';

export function BorewellSettings() {
  const [data, setData] = useState<BorewellSettingsType>({
    addr: -1,        // address
    off: 1.0,        // offset
    rlvl: 0.0,       // reference_level
    rdep: 0.0,       // reference_depth
    bp: 938.42,      // barometric_pressure
    ri: 360,         // reading_interval (minutes)
    si: 1440,        // sending_interval (minutes)
    wid: ''          // well_id
  });
  const [isLoading, setIsLoading] = useState(false);

  const { sendCommand } = useBluetoothService();

  const handleGetData = async () => {
    try {
      setIsLoading(true);
      const response = await sendCommand(CommandPrefix.GET_BOREWELL);
      if (response && response.data) {
        const newData = response.data as unknown as BorewellSettingsType;
        // Validate the received data
        if (typeof newData === 'object' && 
            'addr' in newData && 
            'off' in newData && 
            'rlvl' in newData && 
            'rdep' in newData && 
            'bp' in newData && 
            'ri' in newData && 
            'si' in newData && 
            'wid' in newData) {
          setData(newData);
        } else {
          console.error('Received invalid data format');
        }
      }
    } catch (error) {
      console.error('Error fetching borewell data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetData = async () => {
    try {
      setIsLoading(true);
      await sendCommand(CommandPrefix.SET_BOREWELL, data);
    } catch (error) {
      console.error('Error setting borewell data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Paper p="md">
      <NumberInput
        label="Address"
        value={data.addr}
        onChange={(value) => setData({ ...data, addr: typeof value === 'number' ? value : 0 })}
        mb="sm"
      />
      <NumberInput
        label="Offset"
        value={data.off}
        onChange={(value) => setData({ ...data, off: typeof value === 'number' ? value : 0 })}
        step={0.001}
        mb="sm"
      />
      <NumberInput
        label="Reference Level (m)"
        value={data.rlvl}
        onChange={(value) => setData({ ...data, rlvl: typeof value === 'number' ? value : 0 })}
        step={0.01}
        mb="sm"
      />
      <NumberInput
        label="Reference Depth (m)"
        value={data.rdep}
        onChange={(value) => setData({ ...data, rdep: typeof value === 'number' ? value : 0 })}
        step={0.01}
        mb="sm"
      />
      <NumberInput
        label="Barometric Pressure (hPa)"
        value={data.bp}
        onChange={(value) => setData({ ...data, bp: typeof value === 'number' ? value : 0 })}
        step={0.01}
        mb="sm"
      />
      <NumberInput
        label="Reading Interval (minutes)"
        value={data.ri}
        onChange={(value) => setData({ ...data, ri: typeof value === 'number' ? value : 0 })}
        mb="sm"
      />
      <NumberInput
        label="Sending Interval (minutes)"
        value={data.si}
        onChange={(value) => setData({ ...data, si: typeof value === 'number' ? value : 0 })}
        mb="sm"
      />
      <TextInput
        label="Well ID"
        value={data.wid}
        onChange={(e) => setData({ ...data, wid: e.target.value })}
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