import { Tabs, Paper, Box } from '@mantine/core';
import { TelemetryInfo } from './TelemetryInfo';
import { BorewellSettings } from './BorewellSettings';
import { NetworkSettings } from './NetworkSettings';

export function ConfigTabs() {
  return (
    <Box sx={{ maxWidth: 800, margin: '0 auto', padding: '1rem' }}>
      <Paper shadow="sm" p="md">
        <Tabs defaultValue="telemetry">
          <Tabs.List grow>
            <Tabs.Tab value="telemetry">Telemetry Info</Tabs.Tab>
            <Tabs.Tab value="borewell">Borewell Settings</Tabs.Tab>
            <Tabs.Tab value="network">Network Settings</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="telemetry" pt="xs">
            <TelemetryInfo />
          </Tabs.Panel>

          <Tabs.Panel value="borewell" pt="xs">
            <BorewellSettings />
          </Tabs.Panel>

          <Tabs.Panel value="network" pt="xs">
            <NetworkSettings />
          </Tabs.Panel>
        </Tabs>
      </Paper>
    </Box>
  );
}