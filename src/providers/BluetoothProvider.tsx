import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { notifications } from '@mantine/notifications';
import BluetoothContext from '@/contexts/BluetoothContext';

const BluetoothProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const firstUpdate = useRef(true);
  const [isFailed, setIsFailed] = useState<boolean>(false);
  const [isSupported, setIsSupported] = useState<boolean>(true);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [device, setDevice] = useState<BluetoothDevice | null>(null);

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

  const connect = async (services: string[]) => {
    setIsFailed(false);
    setIsConnecting(true);

    try {
      const device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: false,
        filters: [{ services: services as BluetoothServiceUUID[] }],
      });

      const server = await device.gatt?.connect();
      if (server) {
        device.addEventListener('gattserverdisconnected', onDisconnected);
        setDevice(device);
        setIsConnected(true);
      }
    } catch (error) {
      if (error instanceof DOMException) {
        if (error.name === 'SecurityError') {
          notifications.show({
            message: 'Operation is not permitted in this context due to security concerns.',
            color: 'red',
          });
          setIsFailed(true);
        }
      } else {
        setIsFailed(true);
      }
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

  const onDisconnected = () => {
    setIsConnected(false);
    setDevice(null);
  };

  return (
    <BluetoothContext.Provider
      value={{ isConnected, device, connect, disconnect, isSupported, isFailed, isConnecting }}
    >
      {children}
    </BluetoothContext.Provider>
  );
};

export default BluetoothProvider;
