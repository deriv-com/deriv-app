import { storiesOf } from '@storybook/react';
import { withKnobs, boolean } from '@storybook/addon-knobs';
import RealWalletCard from 'Components/real-wallet-card';
import React from 'react';
import notes from './README.md';
import { getWalletLabels } from './wallet-labels';
import Wrapper from '../shared/wrapper';

storiesOf('RealWalletCard', module)
    .addDecorator(withKnobs)
    .add(
        'Basic Usage',
        () => {
            return (
                <Wrapper>
                    <RealWalletCard
                        amount={100}
                        currency='USD'
                        getWalletLabels={getWalletLabels}
                        has_footer={boolean('has_footer', true)}
                        has_no_funds={boolean('has_no_funds', false)}
                        is_actions_footer={boolean('is_actions_footer', true)}
                        is_deposit_footer={boolean('is_deposit_footer', false)}
                        is_linked={boolean('is_linked', false)}
                        is_selected={boolean('is_selected', false)}
                        is_temporarily_unavailable={boolean('is_temporarily_unavailable', false)}
                        onClickDeposit={() => {
                            console.log('Deposit clicked!');
                        }}
                        onClickSettings={() => {
                            console.log('Settings clicked!');
                        }}
                        onClickTransactions={() => {
                            console.log('Transactions clicked!');
                        }}
                        onClickTransfer={() => {
                            console.log('Transfer clicked!');
                        }}
                        onClickWithdrawal={() => {
                            console.log('Withdrawal clicked!');
                        }}
                        wallet_name='Credit/Debit USD Wallet'
                        width='280'
                    />
                </Wrapper>
            );
        },
        {
            notes,
        }
    );
