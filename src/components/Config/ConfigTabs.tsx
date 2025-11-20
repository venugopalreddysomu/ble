import { Tabs, Paper, Box } from '@mantine/core';
import { useState } from 'react';
import { BorewellSettings } from './BorewellSettings';
import { NetworkSettings } from './NetworkSettings';
import { AdvancedSettings } from './AdvancedSettings';

export function ConfigTabs() {
  const [activeTab, setActiveTab] = useState<string | null>('borewell');

  return (
    <Box style={{ maxWidth: 800, margin: '0 auto', padding: '1rem' }}>
      <Paper shadow="sm" p="md">
        <Tabs value={activeTab} onChange={setActiveTab}>
          <Tabs.List grow>
            <Tabs.Tab value="borewell">Borewell Settings</Tabs.Tab>
            <Tabs.Tab value="network">Network Settings</Tabs.Tab>
            <Tabs.Tab value="advanced">Advanced Settings</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="borewell" pt="xs">
            <BorewellSettings isActive={activeTab === 'borewell'} />
          </Tabs.Panel>

          <Tabs.Panel value="network" pt="xs">
            <NetworkSettings isActive={activeTab === 'network'} />
          </Tabs.Panel>

          <Tabs.Panel value="advanced" pt="xs">
            <AdvancedSettings isActive={activeTab === 'advanced'} />
          </Tabs.Panel>
        </Tabs>
      </Paper>
    </Box>
  );
}