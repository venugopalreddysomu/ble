import sliceStringIntoChunks from './sliceStringIntoChunks';

export enum CommandPrefix {
  GET_DEVINFO = "get_devinfo",
  GET_BOREWELL = "readConfig1",
  SET_BOREWELL = "writeConfig1",
  GET_NETWORK = "readConfig2",
  SET_NETWORK = "writeConfig2",
  GET_ADVANCED = "readConfig3",
  SET_ADVANCED = "writeConfig3",
  GET_LIVE = "readLiveData",
  SET_DATETIME = "set_datetime",
  OPMODE_NORMAL = "opmode normal",
  OPMODE_STORAGE = "opmode storage",
  RESTART = "restart",
  GET_BATTERY = "getbat",
  GET_NVM3_STATUS = "get_nvm3_status",
  SEND_DATA = "senddata",
  GET_DATA = "getdata",
  SET_DEVNAME = "devname",
}

export const sendBluetoothCommand = async (
  characteristic: BluetoothRemoteGATTCharacteristic,
  prefix: CommandPrefix,
  data?: object | string
) => {
  let command: string;
  
  if (typeof data === 'string') {
    // For simple string parameters (like devname or set_datetime)
    command = `${prefix} ${data}\n`;
  } else if (data && typeof data === 'object') {
    // For JSON object data
    command = `${prefix} ${JSON.stringify(data)}\n`;
  } else {
    // No data, just command
    command = `${prefix}\n`;
  }
  
  const encoder = new TextEncoder();
  const chunks = sliceStringIntoChunks(command, 20); // Split into 20-byte chunks
  
  for (const chunk of chunks) {
    await characteristic.writeValue(encoder.encode(chunk));
  }
};