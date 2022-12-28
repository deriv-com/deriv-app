import React from 'react';
import { useHistory } from 'react-router';
import { observer } from 'mobx-react-lite';
import { useStores } from 'Stores/index';
import { Button, Text } from '@deriv/components';
import { formatMoney, getCurrencyName, routes } from '@deriv/shared';
import { localize } from '@deriv/translations';
import CurrencySwitcherContainer from 'Components/containers/currency-switcher-container';
import BalanceText from 'Components/elements/text/balance-text';
import StatusBadge from './switcher-status-badge';
import './real-account-switcher.scss';

const default_balance = { balance: 0, currency: 'USD' };

const AccountNeedsVerification = () => {
    return (
        <CurrencySwitcherContainer
            className='demo-account-card'
            title={
                <Text size='xs' line_height='s'>
                    {localize('Needs Verification')}
                </Text>
            }
            icon='VIRTUAL'
        >
            <StatusBadge />
        </CurrencySwitcherContainer>
    );
};

const RealAccountCard = observer(() => {
    const history = useHistory();
    const { client, traders_hub } = useStores();
    const { accounts, loginid } = client;
    const { openModal } = traders_hub;

    const { balance, currency } = accounts[loginid] || default_balance;

    return (
        <CurrencySwitcherContainer
            className='demo-account-card'
            title={
                <Text size='xs' line_height='s'>
                    {getCurrencyName(currency)}
                </Text>
            }
            icon={currency}
            onClick={() => openModal('currency_selection')}
            actions={
                <Button
                    onClick={(e: MouseEvent) => {
                        e.stopPropagation();
                        history.push(routes.cashier_deposit);
                    }}
                    secondary
                >
                    {localize('Deposit')}
                </Button>
            }
        >
            <BalanceText currency={currency} balance={formatMoney(currency, balance, true)} size='xs' />
        </CurrencySwitcherContainer>
    );
});

const RealAccountSwitcher = () => {
    const { client } = useStores();

    if (client.is_authentication_needed) {
        return <AccountNeedsVerification />;
    }

    if (client.hasAnyRealAccount()) {
        return <RealAccountCard />;
    }

    return null;
};

export default observer(RealAccountSwitcher);
