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
    currency_icon: 'Demo',
    currency: 'Demo',
    loginid_text: 'VRTC6501742',
    balance: '10,000.00',
    account_button: 'Reset',
};

export const AccountUsdollar = Template.bind({});
AccountUsdollar.args = {
    currency_icon: 'CurrencyUSD',
    currency: 'US Dollar',
    loginid_text: 'CR2333683',
    balance: '0.00',
    account_button: 'Deposit',
};
