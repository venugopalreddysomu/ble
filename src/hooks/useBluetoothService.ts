import { useState } from 'react';
import useBluetooth from './useBluetooth';
import { CommandPrefix } from '../utils/bluetoothCommands';

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
        ? `${prefix}:${JSON.stringify(data)}\n`
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
            const [responsePrefix, jsonData] = response.split(':');
            if (responsePrefix === prefix) {
              characteristic.removeEventListener('characteristicvaluechanged', handleResponse);
              resolve({
                success: true,
                data: JSON.parse(jsonData)
              });
            }
          } catch (error) {
            console.error('Error parsing response:', error);
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

function sliceStringIntoChunks(str: string, chunkSize: number): string[] {
  const chunks = [];
  for (let i = 0; i < str.length; i += chunkSize) {
    chunks.push(str.slice(i, i + chunkSize));
  }
  return chunks;
}

export default useBluetoothService;
