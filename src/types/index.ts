export interface TelemetryInfoType {
  project: string;
  unique_id: string;
  telemetry_id: string;
  sensor_id: string;
  current_time: string;
}

export interface BorewellSettingsType {
  address: number;
  offset: number;
  reference_level: number;
  reference_depth: number;
  barometric_pressure: number;
  reading_interval: number;
  sending_interval: number;
  well_id: string;
}

export interface NetworkSettingsType {
  apn: string;
  mobile_number: string;
  auto_mode: boolean;
  force_4g_only: boolean;
  data_logging_only: boolean;
  enable_ipv6: boolean;
  onomondo_sim: boolean;
}

export interface LiveDataType {
  pressure_mH2O: number;
  barometric_pressure_hPa: number;
  temperature_C: number;
  level_meters: number;
  depth_meters: number;
  current_time: string;
  errors: string;
}