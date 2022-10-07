import React from 'react';
import type { Meta, Story } from '@storybook/react';
import OptionsAccount from '../index';

type OptionsAccountProps = Parameters<typeof OptionsAccount>[0];

export default {
    title: 'Account',
} as Meta<OptionsAccountProps>;

const Template: Story<OptionsAccountProps> = args => <OptionsAccount {...args} />;

export const AccountDemo = Template.bind({});
AccountDemo.args = {
    account_icon: 'Demo',
    account_title: 'Demo',
    account_number: 'VRTC6501742',
    account_balance: '10,000.00',
    currency: 'USD',
    account_button: 'Reset',
};

export const AccountUsdollar = Template.bind({});
AccountUsdollar.args = {
    account_icon: 'CurrencyUSD',
    account_title: 'US Dollar',
    account_number: 'CR2333683',
    account_balance: '0.00',
    currency: 'USD',
    account_button: 'Deposit',
};
