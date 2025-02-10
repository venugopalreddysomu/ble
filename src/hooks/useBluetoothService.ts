import { useCallback, useEffect, useRef, useState } from 'react';
import useBluetooth from './useBluetooth';

interface UseBluetoothCharacteristicProps {
  uuid: string;
  onValueChanged?: (value: DataView | undefined) => void;
}

interface UseBluetoothServiceProps {
  uuid: string;
}

const useBluetoothService = (props: UseBluetoothServiceProps) => {
  const bluetooth = useBluetooth();
  const [serviceData, setServiceData] = useState<UseBluetoothServiceProps>(props);
  const [loading, setLoading] = useState<boolean>(true);

  const [service, setService] = useState<BluetoothRemoteGATTService | null>(null);

  useEffect(() => {
    onGetService();
  }, [bluetooth.isConnected]);

  const onGetService = () => {
    if (bluetooth.isConnected) {
      getService();
    } else {
      setService(null);
    }
  };

  const getService = async () => {
    setLoading(true);
    try {
      const ser = await bluetooth.device?.gatt?.getPrimaryService(serviceData.uuid);
      if (ser) {
        setService(ser);
      }
    } catch (error) {
      setService(null);
    }
    setLoading(false);
  };

  const reloadService = (value: UseBluetoothServiceProps) => setServiceData(value);

  const useBluetoothCharacteristic = (props: UseBluetoothCharacteristicProps) => {
    const [characteristic, setCharacteristic] = useState<BluetoothRemoteGATTCharacteristic | null>(
      null
    );
    const characteristicRef = useRef(characteristic);

    useEffect(() => {
      return () => removeCharacteristic();
    }, []);

    useEffect(() => {
      if (service) {
        addCharacteristic();
      }
    }, [service]);

    useEffect(() => {
      characteristicRef.current = characteristic;
    }, [characteristic]);

    const addCharacteristic = async () => {
      try {
        const char = await service?.getCharacteristic(props.uuid);
        if (props.onValueChanged) {
          char
            ?.startNotifications()
            .then((_) =>
              char.addEventListener('characteristicvaluechanged', onCharacteristicValueChanged)
            )
            .catch((_e) => {});
        }
        setCharacteristic(char ?? null);
      } catch (err) {
        err;
      }
    };

    const removeCharacteristic = () => {
      if (props.onValueChanged && characteristicRef.current && bluetooth.isConnected) {
        try {
          characteristicRef.current
            .stopNotifications()
            .then((_) => {
              characteristicRef.current!.removeEventListener(
                'characteristicvaluechanged',
                onCharacteristicValueChanged
              );
            })
            .catch((_e) => {});
        } catch (err) {
          err;
        }
      }
    };

    const onCharacteristicValueChanged = useCallback((ev: Event) => {
      if (props.onValueChanged) {
        props.onValueChanged((ev?.target as BluetoothRemoteGATTCharacteristic).value);
      }
    }, []);

    return { characteristic } as const;
  };

  return { loading, reloadService, service, useBluetoothCharacteristic } as const;
};

export default useBluetoothService;
