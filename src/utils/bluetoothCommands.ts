export enum CommandPrefix {
  GET_TELEMETRY = "CMD:GET_TELEMETRY",
  SET_TELEMETRY = "CMD:SET_TELEMETRY",
  GET_BOREWELL = "CMD:GET_BOREWELL",
  SET_BOREWELL = "CMD:SET_BOREWELL",
  GET_NETWORK = "CMD:GET_NETWORK",
  SET_NETWORK = "CMD:SET_NETWORK",
  GET_LIVE = "CMD:GET_LIVE",
}

export const sendBluetoothCommand = async (
  characteristic: BluetoothRemoteGATTCharacteristic,
  prefix: CommandPrefix,
  data?: object
) => {
  const command = data 
    ? `${prefix}:${JSON.stringify(data)}\n`
    : `${prefix}\n`;
  
  const encoder = new TextEncoder();
  const chunks = sliceStringIntoChunks(command, 20); // Split into 20-byte chunks
  
  for (const chunk of chunks) {
    await characteristic.writeValue(encoder.encode(chunk));
  }
};

function sliceStringIntoChunks(str: string, chunkSize: number): string[] {
  const chunks = [];
  for (let i = 0; i < str.length; i += chunkSize) {
    chunks.push(str.slice(i, i + chunkSize));
  }
  return chunks;
}