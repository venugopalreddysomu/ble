// Error code definitions matching EFR32BG22 firmware
export const ERROR_CODES = {
  ERROR_OK: 0x00,                 // 0: All OK
  ERROR_DPS_FAIL: 0x01,           // 1: DPS (BMP388) sensor failure
  ERROR_SENSOR_FAIL: 0x02,        // 2: General sensor failure
  ERROR_NO_SIM: 0x04,             // 4: No SIM detected
  ERROR_NETWORK_FAIL: 0x08,       // 8: Network connection failure
  ERROR_MODEM_NOT_DETECTED: 0x10, // 16: Modem not detected
  ERROR_SDCARD_FAIL: 0x20,        // 32: SD card failure
  ERROR_OTHER: 0x80,              // 128: Other errors
} as const;

export const ERROR_MESSAGES: Record<number, string> = {
  [ERROR_CODES.ERROR_OK]: 'All OK',
  [ERROR_CODES.ERROR_DPS_FAIL]: 'DPS (BMP388) Sensor Failure',
  [ERROR_CODES.ERROR_SENSOR_FAIL]: 'General Sensor Failure',
  [ERROR_CODES.ERROR_NO_SIM]: 'No SIM Detected',
  [ERROR_CODES.ERROR_NETWORK_FAIL]: 'Network Connection Failure',
  [ERROR_CODES.ERROR_MODEM_NOT_DETECTED]: 'Modem Not Detected',
  [ERROR_CODES.ERROR_SDCARD_FAIL]: 'SD Card Failure',
  [ERROR_CODES.ERROR_OTHER]: 'Other Errors',
};

/**
 * Decodes error code to human-readable messages
 * Since errors can be combined (bitwise OR), this function checks all bits
 * @param errorCode - The error code as number or string
 * @returns Array of error messages
 */
export function decodeErrorCode(errorCode: number | string): string[] {
  // Convert string to number if needed
  const code = typeof errorCode === 'string' ? parseInt(errorCode, 10) : errorCode;
  
  // Check if it's a valid number
  if (isNaN(code)) {
    return ['Unknown Error'];
  }

  // If code is 0, return OK
  if (code === ERROR_CODES.ERROR_OK) {
    return [ERROR_MESSAGES[ERROR_CODES.ERROR_OK]];
  }

  const errors: string[] = [];

  // Check each error bit
  if (code & ERROR_CODES.ERROR_DPS_FAIL) {
    errors.push(ERROR_MESSAGES[ERROR_CODES.ERROR_DPS_FAIL]);
  }
  if (code & ERROR_CODES.ERROR_SENSOR_FAIL) {
    errors.push(ERROR_MESSAGES[ERROR_CODES.ERROR_SENSOR_FAIL]);
  }
  if (code & ERROR_CODES.ERROR_NO_SIM) {
    errors.push(ERROR_MESSAGES[ERROR_CODES.ERROR_NO_SIM]);
  }
  if (code & ERROR_CODES.ERROR_NETWORK_FAIL) {
    errors.push(ERROR_MESSAGES[ERROR_CODES.ERROR_NETWORK_FAIL]);
  }
  if (code & ERROR_CODES.ERROR_MODEM_NOT_DETECTED) {
    errors.push(ERROR_MESSAGES[ERROR_CODES.ERROR_MODEM_NOT_DETECTED]);
  }
  if (code & ERROR_CODES.ERROR_SDCARD_FAIL) {
    errors.push(ERROR_MESSAGES[ERROR_CODES.ERROR_SDCARD_FAIL]);
  }
  if (code & ERROR_CODES.ERROR_OTHER) {
    errors.push(ERROR_MESSAGES[ERROR_CODES.ERROR_OTHER]);
  }

  // If no errors matched, return unknown
  if (errors.length === 0) {
    errors.push(`Unknown Error (Code: ${code})`);
  }

  return errors;
}

/**
 * Gets a color based on error code
 * @param errorCode - The error code
 * @returns Color string for UI
 */
export function getErrorColor(errorCode: number | string): string {
  const code = typeof errorCode === 'string' ? parseInt(errorCode, 10) : errorCode;
  
  if (isNaN(code) || code === ERROR_CODES.ERROR_OK) {
    return 'green';
  }
  
  return 'red';
}
