import React from 'react';
import type { Meta, Story } from '@storybook/react';
import PlatformLauncher from '../index';

type PlatformLauncherProps = Parameters<typeof PlatformLauncher>[0];

export default {
    title: 'PlatformLauncher',
} as Meta<PlatformLauncherProps>;

const Template: Story<PlatformLauncherProps> = args => <PlatformLauncher {...args} />;

export const PlatformLauncherDTrader = Template.bind({});
PlatformLauncherDTrader.args = {
    icon: 'DTrader',
    title: 'DTrader',
    description: 'Options & multipliers trading platform.',
};
export const PlatformLauncherDBot = Template.bind({});
PlatformLauncherDBot.args = {
    icon: 'DBot',
    title: 'DBot',
    description: 'Automate your trading, no coding needed.',
};
export const PlatformLauncherSmartTrader = Template.bind({});
PlatformLauncherSmartTrader.args = {
    icon: 'SmartTrader',
    title: 'SmartTrader',
    description: 'Our legacy options trading platform.',
};
export const PlatformLauncherBinaryBot = Template.bind({});
PlatformLauncherBinaryBot.args = {
    icon: 'BinaryBot',
    title: 'Binary Bot',
    description: 'Our legacy automated trading platform.',
};
export const PlatformLauncherDerivGo = Template.bind({});
PlatformLauncherDerivGo.args = {
    icon: 'DerivGo',
    title: 'DerivGo',
    description: 'Trade on the go with our mobile app.',
};
