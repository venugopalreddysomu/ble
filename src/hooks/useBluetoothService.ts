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
        const handleResponse = (event: Event) => {
          const value = (event.target as BluetoothRemoteGATTCharacteristic).value;
          if (!value) return;

          const decoder = new TextDecoder();
          const response = decoder.decode(value);
          
          try {
            // Handle different response formats
            if (response.includes('OK')) {
              characteristic.removeEventListener('characteristicvaluechanged', handleResponse);
              resolve({
                success: true,
                data: { status: 'success', message: 'Command executed successfully' } as T
              });
              return;
            }
            
            // Try to parse as JSON (for read commands)
            const jsonMatch = response.match(/\{.*\}/);
            if (jsonMatch) {
              characteristic.removeEventListener('characteristicvaluechanged', handleResponse);
              resolve({
                success: true,
                data: JSON.parse(jsonMatch[0])
              });
              return;
            }

            // Handle plain text responses
            characteristic.removeEventListener('characteristicvaluechanged', handleResponse);
            resolve({
              success: true,
              data: response as T
            });
          } catch (error) {
            console.error('Error parsing response:', error);
            characteristic.removeEventListener('characteristicvaluechanged', handleResponse);
            resolve({
              success: false,
              error: 'Failed to parse response'
            });
          }
        };

        characteristic.addEventListener('characteristicvaluechanged', handleResponse);
        
        // Set timeout for response
        setTimeout(() => {
          characteristic.removeEventListener('characteristicvaluechanged', handleResponse);
          resolve({
            success: false,
            error: 'Response timeout'
          });
        }, 5000);
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
