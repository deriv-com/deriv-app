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
    platformlauncherprops: [
        {
            icon: 'DTrader',
            title: 'DTrader',
            description: 'Options & multipliers trading platform.',
            link_to: 'trade',
        },
        {
            icon: 'DBot',
            title: 'DBot',
            description: 'Automate your trading, no coding needed.',
            link_to: 'bot',
        },
        {
            icon: 'SmartTrader',
            title: 'SmartTrader',
            description: 'Our legacy options trading platform.',
            link_to: 'trade',
        },
        {
            icon: 'BinaryBot',
            title: 'Binary Bot',
            description: 'Our legacy automated trading platform.',
            link_to: 'trade',
        },
        {
            icon: 'DerivGo',
            title: 'DerivGo',
            description: 'Trade on the go with our mobile app.',
            link_to: 'trade',
        },
    ],
    // account_props: [
    //     {
    //         account_icon: 'Demo',
    //         account_icon_mobile: 'DemoMobile',
    //         account_title: 'Demo',
    //         account_number: 'VRTC6501742',
    //         account_balance: '10,000.00',
    //         currency: 'USD',
    //         account_button: 'Reset',
    //     },
    //     {
    //         account_icon: 'CurrencyUSD',
    //         account_icon_mobile: 'DemoMobile',
    //         account_title: 'US Dollar',
    //         account_number: 'CR2333683',
    //         account_balance: '0.00',
    //         currency: 'USD',
    //         account_button: 'Deposit',
    //     },
    // ],
    // addoptions_props: {
    //     onClickHandler: Function,
    //     title: 'More Options accounts',
    //     description: 'Including cryptocurrencies',
    //     class_names: '',
    // },
    // applauncher_props: {
    //     icon_name: 'icDxtradeSynthetic',
    //     app_name: 'App name',
    //     jurisdiction: 'JURISDICTION',
    //     is_app_installed: false,
    //     balance: 1.23,
    //     currency: 'USD',
    //     description: 'Trade multipliers on forex, cryptocurrencies, and synthetic indices with our mobile app.',
    //     show_active_balance: false,
    // },
};
