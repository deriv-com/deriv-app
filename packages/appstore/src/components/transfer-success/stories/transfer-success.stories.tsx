import type { Meta, Story } from '@storybook/react';
import React from 'react';
import TransferSuccess from '../index';
import AppStoreAppCard from '../../app-card';
import AppStoreWalletCard from '../../wallet';

type TransferSuccessProps = Parameters<typeof TransferSuccess>[0];

const app_card_details = {
    wallet_name: 'Real',
    wallet_icon: 'icAppstoreWalletUsdLight',
    currency_name: 'USD',
    balance: 1000,
    app_name: 'Deriv MT5 Synthetics USD',
    app_icon: 'icDxtradeSynthetic',
};

const handleTradeClick = () => null;

const handleCloseButtonClick = () => null;

export default {
    title: 'TransferSuccess',
    parameters: { controls: { sort: 'alpha' } },
    argTypes: {
        handleTradeClick: {
            defaultValue: handleTradeClick,
        },
        handleCloseButtonClick: {
            defaultValue: handleCloseButtonClick,
        },
    },
} as Meta<TransferSuccessProps>;

const Template: Story<TransferSuccessProps> = args => <TransferSuccess {...args} />;

export const TransferSuccessComponent = Template.bind({});

TransferSuccessComponent.args = {
    amount_received_to_wallet: (
        <AppStoreAppCard size='large' account_type='Real' app_card_details={app_card_details} linked />
    ),

    amount_send_from_wallet: <AppStoreWalletCard size='large' wallet_name='aud' balance='-1000' />,
    amount: 10000,
    currency: 'USD',
    trading_platform: 'DTrader',
};
