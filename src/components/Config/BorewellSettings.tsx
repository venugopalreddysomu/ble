import { NumberInput, TextInput, Button, Group, Paper } from '@mantine/core';
import { useState } from 'react';
import useBluetoothService from '../../hooks/useBluetoothService';
import { CommandPrefix } from '../../utils/bluetoothCommands';
import { BorewellSettingsType } from '../../types';

export function BorewellSettings() {
  const [data, setData] = useState<BorewellSettingsType>({
    address: -1,
    offset: 1.0,
    reference_level: 0.0,
    reference_depth: 0.0,
    barometric_pressure: 938.42,
    reading_interval: 360,
    sending_interval: 1440,
    well_id: ''
  });

  const { sendCommand } = useBluetoothService();

  const handleGetData = async () => {
    const response = await sendCommand(CommandPrefix.GET_BOREWELL);
    if (response) {
      setData(response.data as unknown as BorewellSettingsType);
    }
  };

  const handleSetData = async () => {
    await sendCommand(CommandPrefix.SET_BOREWELL, data);
  };

  return (
    <Paper p="md">
      <NumberInput
        label="Address"
        value={data.address}
        onChange={(value) => setData({ ...data, address: typeof value === 'number' ? value : 0 })}
        mb="sm"
      />
      <NumberInput
        label="Offset"
        value={data.offset}
        onChange={(value) => setData({ ...data, offset: typeof value === 'number' ? value : 0 })}
        step={0.001}
        mb="sm"
      />
      <NumberInput
        label="Reference Level"
        value={data.reference_level}
        onChange={(value) => setData({ ...data, reference_level: typeof value === 'number' ? value : 0 })}
        step={0.01}
        mb="sm"
      />
      <NumberInput
        label="Reference Depth"
        value={data.reference_depth}
        onChange={(value) => setData({ ...data, reference_depth: typeof value === 'number' ? value : 0 })}
        step={0.01}
        mb="sm"
      />
      <NumberInput
        label="Barometric Pressure"
        value={data.barometric_pressure}
        onChange={(value) => setData({ ...data, barometric_pressure: typeof value === 'number' ? value : 0 })}
        step={0.01}
        mb="sm"
      />
      <NumberInput
        label="Reading Interval"
        value={data.reading_interval}
        onChange={(value) => setData({ ...data, reading_interval: typeof value === 'number' ? value : 0 })}
        mb="sm"
      />
      <NumberInput
        label="Sending Interval"
        value={data.sending_interval}
        onChange={(value) => setData({ ...data, sending_interval: typeof value === 'number' ? value : 0 })}
        mb="sm"
      />
      <TextInput
        label="Well ID"
        value={data.well_id}
        onChange={(e) => setData({ ...data, well_id: e.target.value })}
        mb="sm"
      />
      
      <Group style={{ justifyContent: 'space-between', marginTop: '2rem' }}>
        <Button onClick={handleGetData} variant="filled">Get Data</Button>
        <Button onClick={handleSetData} variant="filled">Set Data</Button>
      </Group>
    </Paper>
  );
}