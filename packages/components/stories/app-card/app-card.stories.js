import { storiesOf } from '@storybook/react';
import { withKnobs, boolean, text } from '@storybook/addon-knobs';
import AppCard from 'Components/app-card';
import React from 'react';
import notes from './README.md';
import { getCardLabels } from './statics/labels';
import Wrapper from '../shared/wrapper';

storiesOf('AppCard', module)
    .addDecorator(withKnobs)
    .add(
        'Basic Usage',
        () => {
            return (
                <Wrapper>
                    <AppCard
                        amount='0.00'
                        app_icon='IcBrandDerivApps'
                        app_name='Deriv Apps'
                        broker='Deriv Limited'
                        currency='USD'
                        getCardLabels={getCardLabels}
                        is_swap_free={boolean('isSwapFree', true)}
                        is_virtual={boolean('isVirtual', true)}
                        linked_wallet='Virtual USD Wallet'
                        login_id='7926972'
                        onAddRealClick={() => {
                            /* eslint-disable no-console */
                            console.log('Add real clicked');
                        }}
                        onDepositClick={() => {
                            /* eslint-disable no-console */
                            console.log('Deposit clicked!');
                        }}
                        onPlayClick={() => {
                            /* eslint-disable no-console */
                            console.log('Play clicked!');
                        }}
                        onSettingsClick={() => {
                            /* eslint-disable no-console */
                            console.log('Settings clicked!');
                        }}
                        onTransactionsClick={() => {
                            /* eslint-disable no-console */
                            console.log('Transactions clicked!');
                        }}
                        onWithdrawClick={() => {
                            /* eslint-disable no-console */
                            console.log('Withdraw clicked!');
                        }}
                        server='Deriv Server'
                        show_footer={boolean('showFooter', true)}
                        show_hover_actions={boolean('showHoverActions', true)}
                        variant={text('variant', 'default')}
                    />
                </Wrapper>
            );
        },
        {
            notes,
        }
    );
