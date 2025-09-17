import { FC } from 'react';
import { Group, Image, Text, Title } from '@mantine/core';
import SilabsLogoLabel from './../../../assets/logo-label.png';
import BluetoothButton from './BluetoothButton';
import classes from './Header.module.css';

const Header: FC<{}> = () => {
  return (
    <Group h="100%" px="sm" justify="space-between" style={{ flex: 1 }}>
      <Group justify="flex-start">
        <Image src={SilabsLogoLabel} alt="Web Bluetooth - SPP" h={35} w="auto" visibleFrom="md" />
        <Image src={SilabsLogoLabel} alt="Web Bluetooth - SPP" h={25} w="auto" hiddenFrom="md" />
        <Title className={classes.title}>
          SWAN DWLR {' '}
          
        </Title>
      </Group>
      <BluetoothButton />
    </Group>
  );
};

export default Header;
