import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { notifications } from '@mantine/notifications';
import BluetoothContext from '@/contexts/BluetoothContext';

// SPP Service UUID
const SPP_SERVICE_UUID = '4880c12c-fdcb-4077-8920-a450d7f9b907';
const SPP_CHARACTERISTIC_UUID = 'fec26ec4-6d71-4442-9f81-55bc21d658d6';

const BluetoothProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const firstUpdate = useRef(true);
  const [isFailed, setIsFailed] = useState<boolean>(false);
  const [isSupported, setIsSupported] = useState<boolean>(true);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [device, setDevice] = useState<BluetoothDevice | null>(null);
  const [characteristic, setCharacteristic] = useState<BluetoothRemoteGATTCharacteristic | null>(null);

  useEffect(() => {
    if (!navigator.bluetooth) {
      setIsSupported(false);
    }
    return () => {
      if (device && device.gatt?.connected) {
        device.gatt.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if (!firstUpdate.current) {
      if (isConnected) {
        notifications.show({
          message: `Device is connected: ${device!.name ?? 'unknown'}`,
          color: 'green',
        });
      } else {
        notifications.show({ message: `Device is disconnected.`, color: 'blue' });
      }
    } else {
      firstUpdate.current = false;
    }
  }, [isConnected]);

  useEffect(() => {
    if (isFailed) {
      notifications.show({
        message: `Failed to connect to the selected device.`,
        color: 'red',
      });
    }
  }, [isFailed]);

  const connect = async () => {
    setIsFailed(false);
    setIsConnecting(true);

    try {
      const device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: [SPP_SERVICE_UUID]
      });

      console.log('Selected device:', device.name);
      const server = await device.gatt?.connect();
      if (server) {
        const service = await server.getPrimaryService(SPP_SERVICE_UUID);
        const characteristics = await service.getCharacteristics();
        console.log('Available characteristics:', characteristics.map(c => c.uuid));
        
        // If no specific characteristic UUID is found, use the first available one
        const characteristic = characteristics.length > 0 ? 
          characteristics[0] : 
          await service.getCharacteristic(SPP_CHARACTERISTIC_UUID);
        
        await characteristic.startNotifications();
        characteristic.addEventListener('characteristicvaluechanged', handleCharacteristicValueChanged);
        
        device.addEventListener('gattserverdisconnected', onDisconnected);
        setDevice(device);
        setCharacteristic(characteristic);
        setIsConnected(true);
      }
    } catch (error) {
      console.error('Connection error:', error);
      if (error instanceof DOMException) {
        if (error.name === 'SecurityError') {
          notifications.show({
            message: 'Operation is not permitted in this context due to security concerns.',
            color: 'red',
          });
        }
      }
      setIsFailed(true);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = () => {
    if (device && device.gatt?.connected) {
      device.gatt.disconnect();
      onDisconnected();
    }
  };

  const handleCharacteristicValueChanged = (event: Event) => {
    const target = event.target as BluetoothRemoteGATTCharacteristic;
    const value = target.value;
    if (!value) return;

    const decoder = new TextDecoder();
    const data = decoder.decode(value);
    
    try {
      // Process incoming data if needed
      console.log('Received data:', data);
    } catch (error) {
      console.error('Error processing data:', error);
    }
  };

  const onDisconnected = () => {
    if (characteristic) {
      characteristic.removeEventListener('characteristicvaluechanged', handleCharacteristicValueChanged);
    }
    setIsConnected(false);
    setDevice(null);
    setCharacteristic(null);
  };

  return (
    <BluetoothContext.Provider
      value={{ 
        isConnected, 
        device, 
        characteristic,
        connect, 
        disconnect, 
        isSupported, 
        isFailed, 
        isConnecting 
      }}
    >
      {children}
    </BluetoothContext.Provider>
  );
};

export default BluetoothProvider;
