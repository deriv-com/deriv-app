import React from 'react';
import type { Meta, Story } from '@storybook/react';
import Options from '../index';

type optionsProps = Parameters<typeof Options>[0];

export default {
    title: 'Options',
} as Meta<optionsProps>;

const Template: Story<optionsProps> = args => <Options {...args} />;

export const OptionsDemo = Template.bind({});
OptionsDemo.args = {
    options_title: 'Options',
    options_desc: 'Earn fixed payouts by predicting price movements with options,or combine the upside of CFDs.',
    platformlauncherprops: [
        {
            app_icon: 'DTrader',
            app_title: 'DTrader',
            app_desc: 'Options & multipliers trading platform.',
        },
        {
            app_icon: 'DBot',
            app_title: 'DBot',
            app_desc: 'Automate your trading, no coding needed.',
        },
        {
            app_icon: 'SmartTrader',
            app_title: 'SmartTrader',
            app_desc: 'Our legacy options trading platform.',
        },
        {
            app_icon: 'BinaryBot',
            app_title: 'Binary Bot',
            app_desc: 'Our legacy automated trading platform.',
        },
        {
            app_icon: 'DerivGo',
            app_title: 'DerivGo',
            app_desc: 'Trade on the go with our mobile app.',
        },
    ],
};
