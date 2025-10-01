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
      if (response && response.success && response.data) {
        // Validate the received data structure
        const receivedData = response.data;
        if (typeof receivedData === 'object' && 
            receivedData !== null &&
            ('p_h2o' in receivedData || 'temp_c' in receivedData || 'err' in receivedData)) {
          // Ensure all numeric values are properly defined with fallbacks
          const validatedData: LiveDataType = {
            p_h2o: typeof receivedData.p_h2o === 'number' ? receivedData.p_h2o : 0,
            bp_hpa: typeof receivedData.bp_hpa === 'number' ? receivedData.bp_hpa : 0,
            temp_c: typeof receivedData.temp_c === 'number' ? receivedData.temp_c : 0,
            lvl_m: typeof receivedData.lvl_m === 'number' ? receivedData.lvl_m : 0,
            dep_m: typeof receivedData.dep_m === 'number' ? receivedData.dep_m : 0,
            t: receivedData.t || new Date().toISOString(),
            err: receivedData.err || 'Unknown'
          };
          setData(validatedData);
        } else {
          console.warn('Invalid data structure received:', receivedData);
        }
      } else {
        console.error('Failed to get live data:', response?.error);
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

  const DataItem = ({ label, value, unit }: { label: string; value: number; unit: string }) => {
    // Ensure value is a valid number
    const safeValue = typeof value === 'number' && !isNaN(value) ? value : 0;
    
    return (
      <Grid.Col span={6}>
        <Paper p="md" withBorder>
          <Text size="sm" color="dimmed">{label}</Text>
          <Text size="xl" style={{ fontWeight: 700 }}>{safeValue.toFixed(2)} {unit}</Text>
        </Paper>
      </Grid.Col>
    );
  };

  return (
    <Box style={{ maxWidth: 800, margin: '0 auto', padding: '1rem' }}>
      {/* Water Level Visualization */}
      <Paper p="md" mb="md" withBorder>
        <Text size="sm" color="dimmed" mb="xs" ta="center">Water Tank (100m total height)</Text>
        <div style={{ height: 300, position: 'relative', background: '#f8f9fa', border: '2px solid #dee2e6' }}>
          {(() => {
            const tankHeight = 100; // Total tank height in meters
            const waterSurfaceLevel = typeof data?.lvl_m === 'number' && !isNaN(data.lvl_m) ? data.lvl_m : 0;
            const filledWater = Math.max(0, tankHeight - waterSurfaceLevel); // Water from bottom
            const fillPercentage = Math.max(0, Math.min(100, (filledWater / tankHeight) * 100));
            
            return (
              <>
                {/* Filled Water (from bottom) */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: `${fillPercentage}%`,
                    background: 'linear-gradient(0deg, #228be6 0%, #74c0fc 100%)',
                    transition: 'height 0.5s ease-in-out'
                  }}
                />
                {/* Water Level Text */}
                <Text 
                  size="xl" 
                  style={{ 
                    position: 'absolute', 
                    top: '20%', 
                    left: '50%', 
                    transform: 'translate(-50%, -50%)',
                    color: '#495057',
                    fontWeight: 700,
                    textShadow: '0 0 4px rgba(255,255,255,0.8)'
                  }}
                >
                  {filledWater.toFixed(1)}m filled
                </Text>
                {/* Surface Level Text */}
                <Text 
                  size="sm" 
                  style={{ 
                    position: 'absolute', 
                    bottom: '10%', 
                    left: '50%', 
                    transform: 'translate(-50%, -50%)',
                    color: '#495057',
                    fontWeight: 600,
                    textShadow: '0 0 4px rgba(255,255,255,0.8)'
                  }}
                >
                  Water Surface: {waterSurfaceLevel.toFixed(1)}m from sensor
                </Text>
              </>
            );
          })()} 
        </div>
      </Paper>

      <Grid>
        <DataItem label="Pressure (piezo)" value={data.p_h2o} unit="mH₂O" />
        <DataItem label="Barometric Pressure" value={data.bp_hpa*0.010197} unit="mH20 (Converted)" />
        <DataItem label="Temperature" value={data.temp_c} unit="°C" />
        <DataItem label="Depth" value={data.dep_m} unit="m" />
      </Grid>

      <Paper p="md" mt="md" withBorder>
        <Grid>
          <Grid.Col span={6}>
            <Text size="sm" color="dimmed">Last Update</Text>
            <Text>{data.t ? new Date(data.t).toLocaleString() : 'No data'}</Text>
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