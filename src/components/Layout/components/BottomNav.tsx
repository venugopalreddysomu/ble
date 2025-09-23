import { IconSettings, IconTerminal, IconChartLine, IconDownload, IconClipboard } from '@tabler/icons-react';
import { Group, UnstyledButton, Text, Box } from '@mantine/core';

interface BottomNavProps {
  active: string;
  onChange: (value: string) => void;
}

export function BottomNav({ active, onChange }: BottomNavProps) {
  const items = [
    { value: 'config', label: 'Config', icon: IconSettings },
    { value: 'terminal', label: 'Terminal', icon: IconTerminal },
    { value: 'live', label: 'LIVE', icon: IconChartLine },
    { value: 'ota', label: 'OTA', icon: IconDownload },
    { value: 'reports', label: 'Reports', icon: IconClipboard },
  ];

  return (
    <Box
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'white',
        borderTop: '1px solid #e9ecef',
        padding: '0.5rem',
      }}
    >
      <Group grow>
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = item.value === active;
          return (
            <UnstyledButton
              key={item.value}
              onClick={() => onChange(item.value)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '0.5rem',
                borderRadius: '0.5rem',
                backgroundColor: isActive ? '#e7f5ff' : 'transparent',
                '&:hover': {
                  backgroundColor: isActive ? '#d0ebff' : '#f8f9fa',
                },
              }}
            >
              <Icon
                size={20}
                style={{
                  marginBottom: '4px',
                  color: isActive ? '#228be6' : '#868e96',
                }}
              />
              <Text
                size="xs"
                style={{
                  color: isActive ? '#228be6' : '#868e96',
                }}
              >
                {item.label}
              </Text>
            </UnstyledButton>
          );
        })}
      </Group>
    </Box>
  );
}