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
    app_icon: 'DTrader',
    app_title: 'DTrader',
    app_desc: 'Options & multipliers trading platform.',
};
export const PlatformLauncherDBot = Template.bind({});
PlatformLauncherDBot.args = {
    app_icon: 'DBot',
    app_title: 'DBot',
    app_desc: 'Automate your trading, no coding needed.',
};
export const PlatformLauncherSmartTrader = Template.bind({});
PlatformLauncherSmartTrader.args = {
    app_icon: 'SmartTrader',
    app_title: 'SmartTrader',
    app_desc: 'Our legacy options trading platform.',
};
export const PlatformLauncherBinaryBot = Template.bind({});
PlatformLauncherBinaryBot.args = {
    app_icon: 'BinaryBot',
    app_title: 'Binary Bot',
    app_desc: 'Our legacy automated trading platform.',
};
export const PlatformLauncherDerivGo = Template.bind({});
PlatformLauncherDerivGo.args = {
    app_icon: 'DerivGo',
    app_title: 'DerivGo',
    app_desc: 'Trade on the go with our mobile app.',
};
