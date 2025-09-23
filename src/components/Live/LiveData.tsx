import { Paper, Text, Grid, Button, Box } from '@mantine/core';
import { useState, useEffect } from 'react';
import useBluetoothService from '../../hooks/useBluetoothService';
import { CommandPrefix } from '../../utils/bluetoothCommands';
import { LiveDataType } from '../../types';

export function LiveData() {
  const [data, setData] = useState<LiveDataType>({
    pressure_mH2O: 0,
    barometric_pressure_hPa: 0,
    temperature_C: 0,
    level_meters: 0,
    depth_meters: 0,
    current_time: new Date().toISOString(),
    errors: 'None'
  });

  const { sendCommand } = useBluetoothService();

  const handleReadLive = async () => {
    const response = await sendCommand(CommandPrefix.GET_LIVE);
    if (response) {
      setData(response as LiveDataType);
    }
  };

  // Auto update every 5 seconds
  useEffect(() => {
    const interval = setInterval(handleReadLive, 5000);
    return () => clearInterval(interval);
  }, []);

  const DataItem = ({ label, value, unit }: { label: string; value: number; unit: string }) => (
    <Grid.Col span={6}>
      <Paper p="md" withBorder>
        <Text size="sm" color="dimmed">{label}</Text>
        <Text size="xl" weight={700}>{value.toFixed(2)} {unit}</Text>
      </Paper>
    </Grid.Col>
  );

  return (
    <Box sx={{ maxWidth: 800, margin: '0 auto', padding: '1rem' }}>
      {/* Water Level Visualization */}
      <Paper p="md" mb="md" withBorder>
        <div style={{ height: 300, position: 'relative', background: '#f8f9fa' }}>
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: `${(data.level_meters / 150) * 100}%`,
              background: 'linear-gradient(0deg, #228be6 0%, #74c0fc 100%)',
              transition: 'height 0.5s ease-in-out'
            }}
          />
          <Text 
            size="xl" 
            weight={700} 
            style={{ 
              position: 'absolute', 
              top: '50%', 
              left: '50%', 
              transform: 'translate(-50%, -50%)',
              color: '#495057'
            }}
          >
            {data.level_meters.toFixed(1)}m
          </Text>
        </div>
      </Paper>

      <Grid>
        <DataItem label="Pressure" value={data.pressure_mH2O} unit="mH₂O" />
        <DataItem label="Barometric Pressure" value={data.barometric_pressure_hPa} unit="hPa" />
        <DataItem label="Temperature" value={data.temperature_C} unit="°C" />
        <DataItem label="Depth" value={data.depth_meters} unit="m" />
      </Grid>

      <Paper p="md" mt="md" withBorder>
        <Grid>
          <Grid.Col span={6}>
            <Text size="sm" color="dimmed">Last Update</Text>
            <Text>{new Date(data.current_time).toLocaleString()}</Text>
          </Grid.Col>
          <Grid.Col span={6}>
            <Text size="sm" color="dimmed">Status</Text>
            <Text color={data.errors === 'None' ? 'green' : 'red'}>{data.errors}</Text>
          </Grid.Col>
        </Grid>
      </Paper>

      <Button 
        fullWidth 
        size="lg" 
        onClick={handleReadLive} 
        mt="md"
      >
        Refresh Data
      </Button>
    </Box>
  );
}