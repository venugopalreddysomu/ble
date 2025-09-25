export interface TelemetryInfoType {
  p: string;           // project
  uid: string;         // unique_id
  tid: string;         // telemetry_id
  sid: string;         // sensor_id
  t: string;           // current_time
}

export interface BorewellSettingsType {
  addr: number;        // address
  off: number;         // offset
  rlvl: number;        // reference_level
  rdep: number;        // reference_depth
  bp: number;          // barometric_pressure
  ri: number;          // reading_interval (minutes)
  si: number;          // sending_interval (minutes)
  wid: string;         // well_id
}

export interface NetworkSettingsType {
  apn: string;         // apn
  mob: string;         // mobile_number
  am: boolean;         // auto_mode
  f4g: boolean;        // force_4g_only
  dlo: boolean;        // data_logging_only
  e6: boolean;         // enable_ipv6
  os: boolean;         // onomondo_sim
}

export interface LiveDataType {
  p_h2o: number;       // pressure_mH2O
  bp_hpa: number;      // barometric_pressure_hPa
  temp_c: number;      // temperature_C
  lvl_m: number;       // level_meters
  dep_m: number;       // depth_meters
  t: string;           // current_time
  err: string;         // errors
}