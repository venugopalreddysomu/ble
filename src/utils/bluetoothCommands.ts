import sliceStringIntoChunks from './sliceStringIntoChunks';

export enum CommandPrefix {
  GET_TELEMETRY = "readConfig1",
  SET_TELEMETRY = "writeConfig1",
  GET_BOREWELL = "readConfig2",
  SET_BOREWELL = "writeConfig2",
  GET_NETWORK = "readConfig3",
  SET_NETWORK = "writeConfig3",
  GET_LIVE = "readLiveData",
}

export const sendBluetoothCommand = async (
  characteristic: BluetoothRemoteGATTCharacteristic,
  prefix: CommandPrefix,
  data?: object
) => {
  const command = data 
    ? `${prefix} ${JSON.stringify(data)}\n`
    : `${prefix}\n`;
  
  const encoder = new TextEncoder();
  const chunks = sliceStringIntoChunks(command, 20); // Split into 20-byte chunks
  
  for (const chunk of chunks) {
    await characteristic.writeValue(encoder.encode(chunk));
  }
};