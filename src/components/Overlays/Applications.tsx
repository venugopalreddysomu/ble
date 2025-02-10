import { FC } from 'react';
import {
  Anchor,
  Card,
  Divider,
  Grid,
  Group,
  Image,
  Paper,
  Stack,
  Text,
  Title,
  useMatches,
} from '@mantine/core';
import bg22ek from '@/assets/bg22-ek4108a-explorer-kit.avif';
import bgm220p from '@/assets/bgm220-ek4314a-explorer-kit.avif';
import GithubLogo from '@/assets/github-mark.svg';
import sparkfun from '@/assets/sparkfun_thing_plus_mgm240p.png';
import xg24dk from '@/assets/xg24-dk2601b.avif';
import xg24ek from '@/assets/xg24ek.png';

const Applications: FC<{}> = () => {
  const cardWidth = useMatches({ base: undefined, md: '1000px' });

  return (
    <>
      <Card
        shadow="sm"
        padding="xl"
        radius="md"
        withBorder
        style={{ width: cardWidth, maxWidth: '1200px', margin: 15 }}
      >
        <Card.Section component="div" m={5}>
          <Title order={3} style={{ textAlign: 'center' }} mb={5}>
            Compatible Application Examples
          </Title>
          <Text style={{ marginBottom: 35, textAlign: 'center' }}>
            This browser-based SPP client example application is compatible with the application
            examples below.
          </Text>
          <Grid columns={13} justify="center" align="flex-start">
            <Grid.Col span={{ xs: 12, md: 'auto' }}>
              <Stack align="center" justify="center" gap="md">
                <Anchor
                  target="_blank"
                  underline="hover"
                  c="black"
                  href="https://github.com/SiliconLabs/bluetooth_applications/tree/master/bluetooth_serial_port_profile"
                >
                  <Paper shadow="xs" p="sm" bg="#FCFCFC">
                    <Stack align="center" justify="center" gap="sm">
                      <Image src={GithubLogo} mah={30} maw={30} w="auto" alt="Github" />
                      <Title order={5} style={{ textAlign: 'center' }}>
                        Bluetooth - Serial Port Profile (SPP)
                      </Title>
                    </Stack>
                  </Paper>
                </Anchor>
                <Divider my="xs" label="Board compatibility" labelPosition="center" w="100%" />
                <Group justify="center" gap="md">
                  <Stack align="center" justify="flex-end" gap="md">
                    <Anchor
                      target="_blank"
                      underline="hover"
                      c="black"
                      href="https://www.silabs.com/development-tools/wireless/efr32xg24-explorer-kit?tab=overview"
                    >
                      <Stack align="center" justify="flex-end" gap="xs">
                        <Image src={xg24ek} mih={75} mah={75} w="auto" alt="xG24EK" />
                        <Text size="xs">EFR32xG24 Explorer Kit</Text>
                      </Stack>
                    </Anchor>
                  </Stack>
                  <Stack align="center" justify="flex-end" gap="md">
                    <Anchor
                      target="_blank"
                      underline="hover"
                      c="black"
                      href="https://www.silabs.com/development-tools/wireless/efr32xg24-dev-kit?tab=overview"
                    >
                      <Stack align="center" justify="flex-end" gap="xs">
                        <Image src={xg24dk} mih={75} mah={75} w="auto" alt="xG24DK" />
                        <Text size="xs">EFR32xG24 Dev Kit</Text>
                      </Stack>
                    </Anchor>
                  </Stack>
                  <Stack align="center" justify="flex-end" gap="md">
                    <Anchor
                      target="_blank"
                      underline="hover"
                      c="black"
                      href="https://www.silabs.com/development-tools/wireless/bluetooth/bgm220-explorer-kit?tab=overview"
                    >
                      <Stack align="center" justify="flex-end" gap="xs">
                        <Image src={bgm220p} mih={75} mah={75} w="auto" alt="BGM220P" />
                        <Text size="xs">BGM220P Explorer Kit</Text>
                      </Stack>
                    </Anchor>
                  </Stack>
                  <Stack align="center" justify="flex-end" gap="md">
                    <Anchor
                      target="_blank"
                      underline="hover"
                      c="black"
                      href="https://www.silabs.com/development-tools/wireless/bluetooth/bg22-explorer-kit?tab=overview"
                    >
                      <Stack align="center" justify="flex-end" gap="xs">
                        <Image src={bg22ek} mih={75} mah={75} w="auto" alt="BG22EK" />
                        <Text size="xs">BG22 Explorer Kit</Text>
                      </Stack>
                    </Anchor>
                  </Stack>
                  <Stack align="center" justify="flex-end" gap="md">
                    <Anchor
                      target="_blank"
                      underline="hover"
                      c="black"
                      href="https://www.sparkfun.com/products/20270"
                    >
                      <Stack align="center" justify="flex-end" gap="xs">
                        <Image
                          src={sparkfun}
                          mih={75}
                          mah={75}
                          w="auto"
                          alt="Sparkfun Thing Plus MGM240P"
                        />
                        <Text size="xs">Sparkfun Thing Plus MGM240P</Text>
                      </Stack>
                    </Anchor>
                  </Stack>
                </Group>
              </Stack>
            </Grid.Col>
            <Grid.Col span="content" style={{ alignSelf: 'stretch' }} visibleFrom="md">
              <Divider orientation="vertical" h="100%" variant="dashed" />
            </Grid.Col>
            <Grid.Col span={{ xs: 12, md: 'auto' }}>
              <Stack align="center" justify="center" gap="md">
                <Anchor
                  target="_blank"
                  underline="hover"
                  c="black"
                  href="https://github.com/SiliconLabs/bluetooth_applications/tree/master/bluetooth_secure_spp_over_ble"
                >
                  <Paper shadow="xs" p="sm" bg="#FCFCFC">
                    <Stack align="center" justify="center" gap="sm">
                      <Image src={GithubLogo} mah={30} maw={30} w="auto" alt="Github" />
                      <Title order={5} style={{ textAlign: 'center' }}>
                        Bluetooth - Secure Serial Port Profile (SPP)
                      </Title>
                    </Stack>
                  </Paper>
                </Anchor>
                <Divider my="xs" label="Board compatibility" labelPosition="center" w="100%" />
                <Group justify="center" gap="md">
                  <Stack align="center" justify="flex-end" gap="md">
                    <Anchor
                      target="_blank"
                      underline="hover"
                      c="black"
                      href="https://www.silabs.com/development-tools/wireless/efr32xg24-dev-kit?tab=overview"
                    >
                      <Stack align="center" justify="flex-end" gap="xs">
                        <Image src={xg24dk} mih={70} mah={70} w="auto" alt="xG24EK" />
                        <Text size="xs">EFR32xG24 Dev Kit</Text>
                      </Stack>
                    </Anchor>
                  </Stack>
                </Group>
              </Stack>
            </Grid.Col>
          </Grid>
        </Card.Section>
      </Card>
    </>
  );
};

export default Applications;
