import React from 'react';
import { observer } from 'mobx-react-lite';
import { Button, Text } from '@deriv/components';
import CurrencySwitcherContainer from 'Components/containers/currency-switcher-container';
import BalanceText from 'Components/elements/text/balance-text';
import { useStores } from 'Stores/index';
import './demo-account-card.scss';
import { localize } from '@deriv/translations';

const DemoAccountCard = () => {
    const { client, traders_hub } = useStores();
    const { accounts, loginid, resetVirtualBalance } = client;
    const { platform_demo_balance, selected_account_type } = traders_hub;

    const canResetBalance = () => {
        return accounts[loginid]?.balance !== 10000;
    };

    return (
        <CurrencySwitcherContainer
            className='demo-account-card'
            icon='VIRTUAL'
            title={
                <Text className='demo-account-card__title' size='xs' line_height='s'>
                    {selected_account_type}
                </Text>
            }
            actions={
                canResetBalance() && (
                    <Button secondary onClick={resetVirtualBalance} className='currency-switcher__button'>
                        {localize('Reset Balance')}
                    </Button>
                )
            }
        >
            <BalanceText currency={platform_demo_balance.currency} balance={platform_demo_balance.balance} size='xs' />
        </CurrencySwitcherContainer>
    );
};

export default observer(DemoAccountCard);
