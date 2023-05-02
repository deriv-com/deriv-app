import React from 'react';
import { observer } from 'mobx-react-lite';
import { Button, Text } from '@deriv/components';
import CurrencySwitcherContainer from 'Components/containers/currency-switcher-container';
import BalanceText from 'Components/elements/text/balance-text';
import './demo-account-card.scss';
import { localize } from '@deriv/translations';
import { usePlatformAccounts } from '@deriv/hooks';
import { useStore } from '@deriv/stores';

const DemoAccountCard = () => {
    const { client, traders_hub } = useStore();
    const { accounts, loginid, resetVirtualBalance, default_currency } = client;
    const { selected_account_type } = traders_hub;
    const { demo: platform_demo_account } = usePlatformAccounts();

    const canResetBalance = () => {
        return loginid && (accounts[loginid]?.balance || 0) !== 10000;
    };

    return (
        <CurrencySwitcherContainer
            className='demo-account-card'
            icon='VIRTUAL'
            title={
                <Text className='demo-account-card__title' size='xs' line_height='s'>
                    {localize(selected_account_type)}
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
            <BalanceText
                currency={platform_demo_account?.currency || default_currency}
                balance={platform_demo_account?.balance || 0}
                size='xs'
            />
        </CurrencySwitcherContainer>
    );
};

export default observer(DemoAccountCard);
