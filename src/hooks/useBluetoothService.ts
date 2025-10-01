import { useState } from 'react';
import useBluetooth from './useBluetooth';
import { CommandPrefix } from '../utils/bluetoothCommands';
import sliceStringIntoChunks from '../utils/sliceStringIntoChunks';

interface BluetoothResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

const useBluetoothService = () => {
  const { characteristic } = useBluetooth();
  const [isProcessing, setIsProcessing] = useState(false);

  const sendCommand = async <T = any>(
    prefix: CommandPrefix, 
    data?: object
  ): Promise<BluetoothResponse<T>> => {
    if (!characteristic) {
      return {
        success: false,
        error: 'Bluetooth not connected'
      };
    }

    try {
      setIsProcessing(true);
      const command = data 
        ? `${prefix} ${JSON.stringify(data)}\n`
        : `${prefix}\n`;
      
      const encoder = new TextEncoder();
      const chunks = sliceStringIntoChunks(command, 20);
      
      for (const chunk of chunks) {
        await characteristic.writeValue(encoder.encode(chunk));
      }

      // Wait for response
      const result = await new Promise<BluetoothResponse<T>>((resolve) => {
        let responseBuffer = '';
        let hasValidJsonResponse = false;

        const handleResponse = (event: Event) => {
          const value = (event.target as BluetoothRemoteGATTCharacteristic).value;
          if (!value) return;

          const decoder = new TextDecoder();
          const response = decoder.decode(value);
          console.log('Received data:', response);
          
          // Accumulate response data
          responseBuffer += response;
          
          try {
            // Handle different response formats
            if (response.includes('OK') && !hasValidJsonResponse) {
              characteristic.removeEventListener('characteristicvaluechanged', handleResponse);
              resolve({
                success: true,
                data: { status: 'success', message: 'Command executed successfully' } as T
              });
              return;
            }
            
            // Try to parse as JSON (for read commands)
            const jsonMatch = responseBuffer.match(/\{[^}]*\}/);
            if (jsonMatch) {
              try {
                const parsedData = JSON.parse(jsonMatch[0]);
                // Validate it's a proper object with expected structure
                if (typeof parsedData === 'object' && parsedData !== null) {
                  hasValidJsonResponse = true;
                  characteristic.removeEventListener('characteristicvaluechanged', handleResponse);
                  resolve({
                    success: true,
                    data: parsedData
                  });
                  return;
                }
              } catch (jsonError) {
                // Invalid JSON, continue waiting for valid JSON
                console.log('Invalid JSON detected, continuing to wait for valid response...');
              }
            }

            // Ignore non-JSON responses (debug logs, status messages, etc.)
            // These are just debug output from the device
            
          } catch (error) {
            console.error('Error processing response:', error);
            // Don't resolve with error immediately, continue waiting for valid JSON
          }
        };

        characteristic.addEventListener('characteristicvaluechanged', handleResponse);
        
        // Set timeout for response (10 seconds for live data, 5 seconds for others)
        const timeoutDuration = prefix === CommandPrefix.GET_LIVE ? 10000 : 5000;
        setTimeout(() => {
          characteristic.removeEventListener('characteristicvaluechanged', handleResponse);
          if (!hasValidJsonResponse) {
            resolve({
              success: false,
              error: `Response timeout after ${timeoutDuration/1000} seconds`
            });
          }
        }, timeoutDuration);
      });

      return result;
    } catch (error) {
      console.error('Error sending command:', error);
      return {
        success: false,
        error: 'Failed to send command'
      };
    } finally {
      setIsProcessing(false);
    }
  };

  return { sendCommand, isProcessing };
};

export default useBluetoothService;
