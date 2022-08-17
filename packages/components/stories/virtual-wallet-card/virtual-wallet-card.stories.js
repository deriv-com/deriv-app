import { storiesOf } from '@storybook/react';
import { withKnobs, boolean } from '@storybook/addon-knobs';
import VirtualWalletCard from 'Components/virtual-wallet-card';
import React from 'react';
import notes from './README.md';
import { getWalletLabels } from '../real-wallet-card/wallet-labels';
import Wrapper from '../shared/wrapper';

storiesOf('VirtualWalletCard', module)
    .addDecorator(withKnobs)
    .add(
        'Basic Usage',
        () => {
            return (
                <Wrapper>
                    <VirtualWalletCard
                        amount={100}
                        currency='USD'
                        getWalletLabels={getWalletLabels}
                        has_footer={boolean('has_footer', true)}
                        has_no_funds={boolean('has_no_funds', false)}
                        is_actions_footer={boolean('is_actions_footer', true)}
                        is_topup_footer={boolean('is_topup_footer', false)}
                        onClickReset={() => {
                            console.log('Reset clicked!');
                        }}
                        onClickTransactions={() => {
                            console.log('Transactions clicked!');
                        }}
                        wallet_name='Virtual USD Wallet'
                        width='280'
                    />
                </Wrapper>
            );
        },
        {
            notes,
        }
    );
