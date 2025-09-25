import { Paper, Text, Grid, Button, Box } from '@mantine/core';
import { useState, useEffect } from 'react';
import useBluetoothService from '../../hooks/useBluetoothService';
import { CommandPrefix } from '../../utils/bluetoothCommands';
import { LiveDataType } from '../../types';

export function LiveData() {
  const [data, setData] = useState<LiveDataType>({
    p_h2o: 0,        // pressure_mH2O
    bp_hpa: 0,       // barometric_pressure_hPa
    temp_c: 0,       // temperature_C
    lvl_m: 0,        // level_meters
    dep_m: 0,        // depth_meters
    t: new Date().toISOString(), // current_time
    err: 'None'      // errors
  });
  const [isLoading, setIsLoading] = useState(false);

  const { sendCommand } = useBluetoothService();

  const handleReadLive = async () => {
    try {
      setIsLoading(true);
      const response = await sendCommand(CommandPrefix.GET_LIVE);
      if (response && response.data) {
        setData(response.data as unknown as LiveDataType);
      }
    } catch (error) {
      console.error('Error reading live data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial data fetch when component mounts
  useEffect(() => {
    handleReadLive();
  }, []);

  const DataItem = ({ label, value, unit }: { label: string; value: number; unit: string }) => (
    <Grid.Col span={6}>
      <Paper p="md" withBorder>
        <Text size="sm" color="dimmed">{label}</Text>
        <Text size="xl" style={{ fontWeight: 700 }}>{value.toFixed(2)} {unit}</Text>
      </Paper>
    </Grid.Col>
  );

  return (
    <Box style={{ maxWidth: 800, margin: '0 auto', padding: '1rem' }}>
      {/* Water Level Visualization */}
      <Paper p="md" mb="md" withBorder>
        <div style={{ height: 300, position: 'relative', background: '#f8f9fa' }}>
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: `${((data?.lvl_m || 0) / 150) * 100}%`,
              background: 'linear-gradient(0deg, #228be6 0%, #74c0fc 100%)',
              transition: 'height 0.5s ease-in-out'
            }}
          />
          <Text 
            size="xl" 
            style={{ 
              position: 'absolute', 
              top: '50%', 
              left: '50%', 
              transform: 'translate(-50%, -50%)',
              color: '#495057',
              fontWeight: 700
            }}
          >
            {(data?.lvl_m || 0).toFixed(1)}m
          </Text>
        </div>
      </Paper>

      <Grid>
        <DataItem label="Pressure" value={data.p_h2o} unit="mH₂O" />
        <DataItem label="Barometric Pressure" value={data.bp_hpa} unit="hPa" />
        <DataItem label="Temperature" value={data.temp_c} unit="°C" />
        <DataItem label="Depth" value={data.dep_m} unit="m" />
      </Grid>

      <Paper p="md" mt="md" withBorder>
        <Grid>
          <Grid.Col span={6}>
            <Text size="sm" color="dimmed">Last Update</Text>
            <Text>{new Date(data.t).toLocaleString()}</Text>
          </Grid.Col>
          <Grid.Col span={6}>
            <Text size="sm" color="dimmed">Status</Text>
            <Text color={data.err === 'None' ? 'green' : 'red'}>{data.err}</Text>
          </Grid.Col>
        </Grid>
      </Paper>

      <Button 
        fullWidth 
        size="lg" 
        onClick={handleReadLive} 
        mt="md"
        loading={isLoading}
        disabled={isLoading}
      >
        {isLoading ? 'Refreshing...' : 'Refresh Data'}
      </Button>
    </Box>
  );
}