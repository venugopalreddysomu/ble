import { NumberInput, TextInput, Button, Group, Paper } from '@mantine/core';
import { useState, useEffect } from 'react';
import useBluetoothService from '../../hooks/useBluetoothService';
import { CommandPrefix } from '../../utils/bluetoothCommands';
import { BorewellSettingsType } from '../../types';

interface BorewellSettingsProps {
  isActive: boolean;
}

export function BorewellSettings({ isActive }: BorewellSettingsProps) {
  const [data, setData] = useState<BorewellSettingsType>({
    off: 0,          // reference_offset
    rlvl: 0,         // reference_level
    rdep: 0,         // reference_depth
    mbp: 0,          // manual_barometric_pressure
    bid: ''          // borewell_id
  });
  const [isLoading, setIsLoading] = useState(false);

  const { sendCommand } = useBluetoothService();

  const handleGetData = async () => {
    try {
      setIsLoading(true);
      const response = await sendCommand<BorewellSettingsType>(CommandPrefix.GET_BOREWELL);
      if (response && response.success && response.data) {
        setData(response.data);
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

  // Auto-load data when component mounts
  useEffect(() => {
    if (isActive) {
      handleGetData();
    }
  }, [isActive]);

  return (
    <Paper p="md">
      <NumberInput
        label="Reference Offset"
        description="Offset value for sensor calibration"
        value={data.off}
        onChange={(value) => setData({ ...data, off: typeof value === 'number' ? value : 0 })}
        step={0.1}
        mb="sm"
      />
      <NumberInput
        label="Reference Level (m)"
        description="Reference water level in meters"
        value={data.rlvl}
        onChange={(value) => setData({ ...data, rlvl: typeof value === 'number' ? value : 0 })}
        step={0.01}
        mb="sm"
      />
      <NumberInput
        label="Reference Depth (m)"
        description="Reference depth measurement in meters"
        value={data.rdep}
        onChange={(value) => setData({ ...data, rdep: typeof value === 'number' ? value : 0 })}
        step={0.01}
        mb="sm"
      />
      <NumberInput
        label="Manual Barometric Pressure (hPa)"
        description="Manual barometric pressure setting in hectopascals"
        value={data.mbp}
        onChange={(value) => setData({ ...data, mbp: typeof value === 'number' ? value : 0 })}
        step={0.01}
        mb="sm"
      />
      <TextInput
        label="Borewell ID"
        description="Unique identifier for this borewell"
        value={data.bid}
        onChange={(e) => setData({ ...data, bid: e.target.value })}
        mb="sm"
        placeholder="e.g., BOREWELL-00"
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