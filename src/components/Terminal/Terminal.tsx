import { FC, JSX, useEffect, useRef, useState } from 'react';
import { IconTrashX } from '@tabler/icons-react';
import {
  ActionIcon,
  Box,
  Button,
  Grid,
  Group,
  Input,
  Paper,
  rem,
  ScrollArea,
  Select,
  Stack,
  Switch,
  useMantineColorScheme,
  useMatches,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import useBluetooth from '@/hooks/useBluetooth';
import useLoader from '@/hooks/useLoader';
import dataviewToString from '@/utils/dataviewToString';
import sliceStringIntoChunks from '@/utils/sliceStringIntoChunks';
import stringToUint8Array from '@/utils/stringToUint8Array';
import classes from './Terminal.module.css';

interface TerminalProps {}

const Terminal: FC<TerminalProps> = () => {
  const loader = useLoader();
  const { characteristic } = useBluetooth();
  const { colorScheme } = useMantineColorScheme();

  const viewportRef = useRef<HTMLDivElement>(null);
  const viewportSize = useMatches({
    base: 'calc(100vh - var(--app-shell-header-height) - var(--app-shell-footer-height) - 32vh)',
    md: 'calc(100vh - var(--app-shell-header-height) - var(--app-shell-footer-height) - 17vh)',
  });

  const [command, setCommand] = useState<string>('');
  const [echoing, setEchoing] = useState<boolean>(true);
  const [content, setContent] = useState<(string | JSX.Element)[]>([]);
  const [lineTerminator, setLineTerminator] = useState<string | null>('CR-LF');

  const clear = () => setContent([]);
  const append = (content: string | JSX.Element) => setContent((prev) => [...prev, content]);

  useEffect(() => {
    if (characteristic) {
      characteristic.addEventListener('characteristicvaluechanged', (event: Event) => {
        const target = event.target as BluetoothRemoteGATTCharacteristic;
        if (target.value) {
          const receivedContent = dataviewToString(target.value);
          append(receivedContent);
        }
      });
    }
  }, [characteristic]);

  const sendCommand = async (cmd: string) => {
    if (!characteristic) return;

    const ltMap: Record<string, string> = {
      None: '',
      'CR-LF': '\r\n',
      CR: '\r',
      LF: '\n',
    };

    let data = cmd;
    if (lineTerminator !== null && lineTerminator !== 'None') {
      data += ltMap[lineTerminator];
    }

    if (echoing) {
      append(
        <span key={content.length} style={{ color: '#0080FF' }}>
          {data}
        </span>
      );
    }

    const chunks = sliceStringIntoChunks(data);

    try {
      for (let i = 0; i < chunks.length; i++) {
        await characteristic.writeValue(stringToUint8Array(chunks[i]));
      }
    } catch (error) {
      notifications.show({ message: 'Failed to send data to the connected device.', color: 'red' });
    }
  };

  const send = async () => {
    if (!command) return;
    await sendCommand(command);
    setCommand('');
  };

  useEffect(() => {
    if (viewportRef.current) {
      viewportRef.current.scrollTo({ top: viewportRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [content]);

  useEffect(() => {
    if (characteristic) {
      loader.setLoading(false);
    }
  }, [characteristic]);

  return (
    <Box p="md">
      <Paper shadow="xs" radius="sm" withBorder>
        <Stack gap={0}>
          {/* Terminal Output Area */}
          <Box style={{ position: 'relative', height: '400px' }}>
            <ScrollArea 
              h="100%"
              offsetScrollbars
              scrollbarSize={6}
              viewportRef={viewportRef}
            >
              <Box p="xs" className={classes.viewportPre}>
                {content}
              </Box>
            </ScrollArea>

            {/* Controls overlay */}
            <Box 
              style={{ 
                position: 'absolute', 
                top: 10, 
                right: 10,
                display: 'flex',
                gap: '8px',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                padding: '4px',
                borderRadius: '4px',
                zIndex: 100
              }}
            >
              <Switch
                size="md"
                label="Echo"
                checked={echoing}
                onChange={(e) => setEchoing(e.currentTarget.checked)}
              />
              <ActionIcon
                variant="light"
                color="red"
                onClick={clear}
                size="lg"
              >
                <IconTrashX style={{ width: rem(20), height: rem(20) }} stroke={1.5} />
              </ActionIcon>
            </Box>
          </Box>

          {/* Input Controls */}
          <Box p="xs">
            <Grid align="flex-end">
              <Grid.Col span={8}>
                <Input
                  size="md"
                  placeholder="Type a command"
                  value={command}
                  onKeyDown={(e) => {
                    if (e.code === 'Enter') {
                      send();
                    }
                  }}
                  onChange={(event) => {
                    setCommand(event.currentTarget.value);
                  }}
                />
              </Grid.Col>
              <Grid.Col span={4}>
                <Select
                  size="md"
                  placeholder="Line terminator"
                  value={lineTerminator}
                  data={['None', 'CR-LF', 'CR', 'LF']}
                  allowDeselect={false}
                  onChange={setLineTerminator}
                />
              </Grid.Col>
            </Grid>
            
            {/* Command Buttons */}
            <Box mt="md">
              <Group gap="xs" justify="flex-start">
                <Button size="xs" variant="filled" onClick={send}>
                  Send
                </Button>
                <Button size="xs" variant="light" onClick={() => sendCommand('get_devinfo')}>
                  Device Info
                </Button>
                <Button size="xs" variant="light" onClick={() => sendCommand('readLiveData')}>
                  Live Data
                </Button>
                <Button size="xs" variant="light" onClick={() => sendCommand('getbat')}>
                  Battery
                </Button>
                <Button size="xs" variant="light" onClick={() => sendCommand('get_nvm3_status')}>
                  NVM3 Status
                </Button>
                <Button size="xs" variant="light" onClick={() => sendCommand('senddata')}>
                  Send Data
                </Button>
                <Button size="xs" variant="light" onClick={() => sendCommand('getdata')}>
                  Get Data
                </Button>
              </Group>
            </Box>
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
};

export default Terminal;
