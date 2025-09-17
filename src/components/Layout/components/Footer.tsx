import { Anchor, Divider, Group, Image, Text } from '@mantine/core';
import GithubLogo from '@/assets/github-mark.svg';
import { FC } from 'react';

const Footer: FC<{}> = () => {
  const version = __APP_VERSION__;
  const github = __APP_GIT_REPO_PATH__;

  return (
    <Group justify="space-between" h="100%" px={15}>
      <Text visibleFrom="md">© {new Date().getFullYear()} BridgeThings. All rights reserved.</Text>
      <Text hiddenFrom="md">© {new Date().getFullYear()} BridgeThings</Text>
      <Group justify="flex-end" gap="sm">
        <Anchor
          target="_blank"
          underline="hover"
          c="black"
          href={`${github}/releases/tag/v${version}`}
        >
          v{version}
        </Anchor>
        <Divider orientation="vertical" />
        <Anchor target="_blank" underline="hover" c="black" href={github} display="flex">
          <Image src={GithubLogo} alt="Github" h={20} w={100}/>
        </Anchor>
      </Group>
    </Group>
  );
};

export default Footer;
