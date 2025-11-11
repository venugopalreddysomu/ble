import { Tabs, Paper, Box } from '@mantine/core';
import { BorewellSettings } from './BorewellSettings';
import { NetworkSettings } from './NetworkSettings';
import { AdvancedSettings } from './AdvancedSettings';

export function ConfigTabs() {
  return (
    <Box style={{ maxWidth: 800, margin: '0 auto', padding: '1rem' }}>
      <Paper shadow="sm" p="md">
        <Tabs defaultValue="borewell">
          <Tabs.List grow>
            <Tabs.Tab value="borewell">Borewell Settings</Tabs.Tab>
            <Tabs.Tab value="network">Network Settings</Tabs.Tab>
            <Tabs.Tab value="advanced">Advanced Settings</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="borewell" pt="xs">
            <BorewellSettings />
          </Tabs.Panel>

          <Tabs.Panel value="network" pt="xs">
            <NetworkSettings />
          </Tabs.Panel>

          <Tabs.Panel value="advanced" pt="xs">
            <AdvancedSettings />
          </Tabs.Panel>
        </Tabs>
      </Paper>
    </Box>
  );
}