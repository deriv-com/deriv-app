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
    is_app_launcher: false,
    is_demo_account: false,
    platformlauncherprops: [
        {
            app_icon: 'DTrader',
            app_title: 'DTrader',
            app_desc: 'Options & multipliers trading platform.',
            app_url: 'trade',
        },
        {
            app_icon: 'DBot',
            app_title: 'DBot',
            app_desc: 'Automate your trading, no coding needed.',
            app_url: 'bot',
        },
        {
            app_icon: 'SmartTrader',
            app_title: 'SmartTrader',
            app_desc: 'Our legacy options trading platform.',
            app_url: 'trade',
        },
        {
            app_icon: 'BinaryBot',
            app_title: 'Binary Bot',
            app_desc: 'Our legacy automated trading platform.',
            app_url: 'trade',
        },
        {
            app_icon: 'DerivGo',
            app_title: 'DerivGo',
            app_desc: 'Trade on the go with our mobile app.',
            app_url: 'trade',
        },
    ],
    account_props: [
        {
            account_icon: 'Demo',
            account_icon_mobile: 'DemoMobile',
            account_title: 'Demo',
            account_number: 'VRTC6501742',
            account_balance: '10,000.00',
            currency: 'USD',
            account_button: 'Reset',
        },
        {
            account_icon: 'CurrencyUSD',
            account_icon_mobile: 'DemoMobile',
            account_title: 'US Dollar',
            account_number: 'CR2333683',
            account_balance: '0.00',
            currency: 'USD',
            account_button: 'Deposit',
        },
    ],
    addoptions_props: {
        onClickHandler: Function,
        title: 'More Options accounts',
        description: 'Including cryptocurrencies',
        class_names: '',
    },
    applauncher_props: {
        icon_name: 'icDxtradeSynthetic',
        app_name: 'App name',
        jurisdiction: 'JURISDICTION',
        is_app_installed: false,
        balance: 1.23,
        currency: 'USD',
        description: 'Trade multipliers on forex, cryptocurrencies, and synthetic indices with our mobile app.',
        show_active_balance: false,
    },
};
