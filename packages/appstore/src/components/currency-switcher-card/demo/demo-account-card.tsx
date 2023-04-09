import React from 'react';
import { observer } from 'mobx-react-lite';
import { Button, Text } from '@deriv/components';
import CurrencySwitcherContainer from 'Components/containers/currency-switcher-container';
import BalanceText from 'Components/elements/text/balance-text';
import { useStores } from 'Stores/index';
import './demo-account-card.scss';
import { localize } from '@deriv/translations';
import {
    useCFDDemoAccounts,
    useCurrencyExchangeRate,
    usePlatformDemoAccount,
    useTotalAccountBalance,
} from '@deriv/hooks';

const DemoAccountCard = () => {
    const { client, traders_hub } = useStores();
    const { accounts, loginid, resetVirtualBalance, default_currency } = client;
    const { selected_account_type } = traders_hub;

    const canResetBalance = () => {
        return accounts[loginid]?.balance !== 10000;
    };

    const platform_demo_account = usePlatformDemoAccount();
    const cfd_demo_accounts = useCFDDemoAccounts();
    const cfd_demo_balance = useTotalAccountBalance(cfd_demo_accounts);
    const cfd_demo_rate = useCurrencyExchangeRate(platform_demo_account.currency);

    const DemoAccounttotalBalance = React.useMemo(() => {
        return {
            balance: platform_demo_account.balance + cfd_demo_balance.balance * cfd_demo_rate,
            currency: platform_demo_account.currency,
        };
    }, [cfd_demo_balance.balance, cfd_demo_rate, platform_demo_account.balance, platform_demo_account.currency]);

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
            <BalanceText
                currency={DemoAccounttotalBalance.currency || default_currency}
                balance={DemoAccounttotalBalance.balance}
                size='xs'
            />
        </CurrencySwitcherContainer>
    );
};

export default observer(DemoAccountCard);
