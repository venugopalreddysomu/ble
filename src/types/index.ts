export interface DeviceInfoType {
  firmware_version: number;    // firmware version
  bt_mac: string;              // Bluetooth MAC address
  sensor_serial: number;       // sensor serial number
  project_name: string;        // project name
  mhost: string;               // MQTT host
  devTime: string;             // device time
  opmode: string;              // operation mode (NORMAL or STORAGE)
  btname: string;              // Bluetooth device name
  alarms: string;              // alarm times (comma-separated)
}

export interface BorewellSettingsType {
  off: number;         // reference_offset
  rlvl: number;        // reference_level
  rdep: number;        // reference_depth
  mbp: number;         // manual_barometric_pressure
  bid: string;         // borewell_id
}

export interface NetworkSettingsType {
  apn: string;         // apn
  am: boolean;         // auto_mode
  f4g: boolean;        // force_4g_only
  dlo: boolean;        // data_logging_only
  e6: boolean;         // enable_ipv6
  msig: number;        // minimum_signal_level
}

export interface AdvancedSettingsType {
  pname: string;       // project_name
  alarms: string;      // alarm times (comma-separated)
  mhost: string;       // MQTT host
  mqttu: string;       // MQTT username
  mqttp: string;       // MQTT password
}

export interface LiveDataType {
  p_h2o: number;       // pressure_mH2O
  bp_hpa: number;      // barometric_pressure_hPa
  temp_c: number;      // temperature_C
  lvl_m: number;       // level_meters
  dep_m: number;       // depth_meters
  t: string;           // current_time
  err: number | string; // error code (can be number or string)
}