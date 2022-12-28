import React from 'react';
import { useHistory } from 'react-router';
import { observer } from 'mobx-react-lite';
import { Button, Text } from '@deriv/components';
import { formatMoney, getCurrencyName, routes } from '@deriv/shared';
import { localize } from '@deriv/translations';
import BalanceText from 'Components/elements/text/balance-text';
import CurrencySwitcherContainer from 'Components/containers/currency-switcher-container';
import { useStores } from 'Stores/index';

const default_balance = { balance: 0, currency: 'USD' };

const RealAccountCard = () => {
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
            has_interaction
        >
            <BalanceText currency={currency} balance={formatMoney(currency, balance, true)} size='xs' />
        </CurrencySwitcherContainer>
    );
};

export default observer(RealAccountCard);
