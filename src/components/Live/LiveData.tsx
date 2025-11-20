import { Paper, Text, Grid, Button, Box, Badge, Group, Modal } from '@mantine/core';
import { useState, useEffect } from 'react';
import { notifications } from '@mantine/notifications';
import useBluetoothService from '../../hooks/useBluetoothService';
import { CommandPrefix } from '../../utils/bluetoothCommands';
import { LiveDataType } from '../../types';
import { decodeErrorCode, getErrorColor } from '../../utils/errorDecoder';

export function LiveData() {
  const [data, setData] = useState<LiveDataType>({
    p_h2o: 0,        // pressure_mH2O
    bp_hpa: 0,       // barometric_pressure_hPa
    temp_c: 0,       // temperature_C
    lvl_m: 0,        // level_meters
    dep_m: 0,        // depth_meters
    t: new Date().toISOString(), // current_time
    err: 0           // error code
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isCalibrating, setIsCalibrating] = useState(false);
  const [showCalibrateModal, setShowCalibrateModal] = useState(false);

  const { sendCommand } = useBluetoothService();

  const handleCalibrate = async () => {
    setShowCalibrateModal(false);
    
    try {
      setIsCalibrating(true);
      
      // Calculate offset: barometric_pressure_converted / piezo_pressure
      const barometricConverted = data.bp_hpa * 0.010197;
      const offset = barometricConverted / data.p_h2o;
      
      if (!isFinite(offset) || data.p_h2o === 0) {
        console.error('Invalid calibration values. Piezo pressure cannot be zero.');
        notifications.show({
          title: 'Calibration Failed',
          message: 'Invalid pressure readings. Ensure sensor is out of water and readings are valid.',
          color: 'red',
        });
        return;
      }
      
      // Send the offset to the device
      const response = await sendCommand(CommandPrefix.SET_BOREWELL, { off: offset });
      
      if (response.success) {
        console.log('Calibration successful. Offset:', offset);
        notifications.show({
          title: 'Calibration Successful',
          message: `Reference offset set to ${offset.toFixed(4)}`,
          color: 'green',
        });
      } else {
        notifications.show({
          title: 'Calibration Failed',
          message: 'Failed to send calibration data to device.',
          color: 'red',
        });
      }
    } catch (error) {
      console.error('Error during calibration:', error);
      notifications.show({
        title: 'Calibration Error',
        message: 'An error occurred during calibration.',
        color: 'red',
      });
    } finally {
      setIsCalibrating(false);
    }
  };

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
            err: receivedData.err !== undefined ? receivedData.err : 0
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

  const DataItem = ({ label, value, unit, decimals = 2 }: { label: string; value: number; unit: string; decimals?: number }) => {
    // Ensure value is a valid number
    const safeValue = typeof value === 'number' && !isNaN(value) ? value : 0;
    
    return (
      <Grid.Col span={6}>
        <Paper p="md" withBorder>
          <Text size="sm" color="dimmed">{label}</Text>
          <Text size="xl" style={{ fontWeight: 700 }}>{safeValue.toFixed(decimals)} {unit}</Text>
        </Paper>
      </Grid.Col>
    );
  };

  return (
    <Box style={{ maxWidth: 800, margin: '0 auto', padding: '1rem' }}>
      {/* Water Level Visualization */}
      <Paper p="md" mb="md" withBorder>
        {(() => {
          const waterSurfaceLevel = typeof data?.lvl_m === 'number' && !isNaN(data.lvl_m) ? data.lvl_m : 0;
          const depth = typeof data?.dep_m === 'number' && !isNaN(data.dep_m) ? data.dep_m : 0;
          const tankHeight = waterSurfaceLevel + depth; // Total tank height = water level + depth
          
          return <Text size="sm" color="dimmed" mb="xs" ta="center">Borewell ({tankHeight.toFixed(2)}m installed height)</Text>;
        })()}
        <div style={{ height: 300, position: 'relative', background: '#f8f9fa', border: '2px solid #dee2e6' }}>
          {(() => {
            const waterSurfaceLevel = typeof data?.lvl_m === 'number' && !isNaN(data.lvl_m) ? data.lvl_m : 0;
            const depth = typeof data?.dep_m === 'number' && !isNaN(data.dep_m) ? data.dep_m : 0;
            const tankHeight = waterSurfaceLevel + depth; // Total tank height = water level + depth
            const filledWater = Math.max(0, tankHeight - waterSurfaceLevel); // Water from bottom
            const fillPercentage = tankHeight > 0 ? Math.max(0, Math.min(100, (filledWater / tankHeight) * 100)) : 0;
            
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
                  {filledWater.toFixed(4)}m filled from sensor tip
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
                  Water Level: {waterSurfaceLevel.toFixed(4)}m from Earch
                </Text>
              </>
            );
          })()} 
        </div>
      </Paper>

      <Grid>
        <DataItem label="Pressure (piezo)" value={data.p_h2o} unit="mH₂O" />
        <DataItem label="Barometric Pressure" value={data.bp_hpa*0.010197} unit="mH₂O (Converted)" />
        <DataItem label="Temperature" value={data.temp_c} unit="°C" />
        <DataItem label="Depth" value={data.dep_m} unit="m" decimals={4} />
      </Grid>

      <Paper p="md" mt="md" withBorder>
        <Grid>
          <Grid.Col span={12}>
            <Text size="sm" color="dimmed" mb="xs">Water Level (From Earth Surface)</Text>
            <Paper p="md" withBorder style={{ backgroundColor: '#f8f9fa' }}>
              <Text size="xl" fw={700} ta="center">
                {(typeof data.lvl_m === 'number' && !isNaN(data.lvl_m) ? data.lvl_m : 0).toFixed(4)} m
              </Text>
            </Paper>
          </Grid.Col>
        </Grid>
      </Paper>

      <Paper p="md" mt="md" withBorder>
        <Grid>
          <Grid.Col span={6}>
            <Text size="sm" color="dimmed">Last Update</Text>
            <Text>{data.t ? new Date(data.t).toLocaleString() : 'No data'}</Text>
          </Grid.Col>
          <Grid.Col span={6}>
            <Text size="sm" color="dimmed" mb="xs">Status</Text>
            {(() => {
              const errorMessages = decodeErrorCode(data.err);
              const errorColor = getErrorColor(data.err);
              
              return (
                <Group gap="xs">
                  {errorMessages.map((msg, idx) => (
                    <Badge key={idx} color={errorColor} variant="filled">
                      {msg}
                    </Badge>
                  ))}
                </Group>
              );
            })()}
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

      <Paper p="md" mt="md" withBorder style={{ backgroundColor: '#fff3cd' }}>
        <Text size="sm" fw={600} mb="xs" c="orange">⚠️ Sensor Calibration</Text>
        <Text size="xs" mb="sm" c="dimmed">
          <strong>Warning:</strong> Only click the calibrate button when the sensor is completely out of water.
          This will calculate and set the reference offset based on current pressure readings.
        </Text>
        <Button 
          fullWidth
          size="md"
          color="orange"
          onClick={() => setShowCalibrateModal(true)}
          loading={isCalibrating}
          disabled={isCalibrating || isLoading || data.p_h2o === 0}
        >
          {isCalibrating ? 'Calibrating...' : 'Calibrate Sensor'}
        </Button>
      </Paper>

      {/* Calibration Confirmation Modal */}
      <Modal
        opened={showCalibrateModal}
        onClose={() => setShowCalibrateModal(false)}
        title="⚠️ Calibration Warning"
        centered
      >
        <Text size="sm" mb="md">
          <strong>Are you sure you want to calibrate the sensor?</strong>
        </Text>
        <Text size="sm" mb="md" c="dimmed">
          This action will:
          <ul style={{ marginTop: '8px', paddingLeft: '20px' }}>
            <li>Calculate a new reference offset value</li>
            <li>Override the current offset setting</li>
          </ul>
        </Text>
        <Text size="sm" mb="lg" fw={600} c="orange">
          ⚠️ Ensure the sensor is completely out of water before proceeding!
        </Text>
        <Group justify="flex-end">
          <Button variant="light" onClick={() => setShowCalibrateModal(false)}>
            Cancel
          </Button>
          <Button 
            color="orange"
            onClick={handleCalibrate}
          >
            Yes, Calibrate Now
          </Button>
        </Group>
      </Modal>
    </Box>
  );
}