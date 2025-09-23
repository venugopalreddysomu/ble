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

  const send = async () => {
    if (!command || !characteristic) return;

    const chunks = prepareData();

    try {
      for (let i = 0; i < chunks.length; i++) {
        await characteristic.writeValue(stringToUint8Array(chunks[i]));
      }
      setCommand('');
    } catch (error) {
      notifications.show({ message: 'Failed to send data to the connected device.', color: 'red' });
    }
  };

  const sendSetTimeCommand = async () => {
    if (!characteristic) return;

    // Get the standard Unix timestamp (seconds since epoch)
    const currentTimestamp = Math.floor(new Date().getTime() / 1000);

    // Define the IST offset in seconds (5 hours * 3600) + (30 minutes * 60)
    const istOffsetInSeconds = 19800;

    // Create the new timestamp with the offset added for your device
    const adjustedTimestamp = currentTimestamp + istOffsetInSeconds;

    // Construct the command string with the new adjusted timestamp
    const setTimeCommand = `set_datetime ${adjustedTimestamp}`;

    // The rest of the sending logic remains the same
    const ltMap: Record<string, string> = {
      None: '',
      'CR-LF': '\r\n',
      CR: '\r',
      LF: '\n',
    };

    let data = setTimeCommand;
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

  // Find the existing 'send' function and add this function below it
  const getTimeCommand = async () => {
    if (!characteristic) return;

    // The specific text you want to send
    const timeCommand = 'get_datetime';

    // This logic is copied from the 'prepareData' function to ensure
    // your command is formatted and echoed correctly.
    const ltMap: Record<string, string> = {
      None: '',
      'CR-LF': '\r\n',
      CR: '\r',
      LF: '\n',
    };

    let data = timeCommand;
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

    // This is the logic that sends the data over Bluetooth
    try {
      for (let i = 0; i < chunks.length; i++) {
        await characteristic.writeValue(stringToUint8Array(chunks[i]));
      }
    } catch (error) {
      notifications.show({ message: 'Failed to send data to the connected device.', color: 'red' });
    }
  };
  const prepareData = (): string[] => {
    const ltMap: Record<string, string> = {
      None: '',
      'CR-LF': '\r\n',
      CR: '\r',
      LF: '\n',
    };

    let data = command;
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
    return sliceStringIntoChunks(data);
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
    <Box p="md" style={{ height: 'calc(100vh - 140px)' }}>
      <Paper shadow="xs" radius="sm" withBorder style={{ height: '100%' }}>
        <Stack h="100%" gap={0}>
          {/* Terminal Output Area */}
          <Box style={{ flex: 1, position: 'relative' }}>
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
                borderRadius: '4px'
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
                  placeholder="Type a text"
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
            <Box mt="xs" style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <Button size="sm" variant="light" onClick={send}>
                Send
              </Button>
              <Button size="sm" variant="light" onClick={getTimeCommand}>
                Get Device Time
              </Button>
              <Button size="sm" variant="light" onClick={sendSetTimeCommand}>
                Send Time
              </Button>
            </Box>
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
};

export default Terminal;
