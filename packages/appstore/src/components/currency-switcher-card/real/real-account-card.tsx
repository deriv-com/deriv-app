import React from 'react';
import { useHistory } from 'react-router';
import { observer } from 'mobx-react-lite';
import { Button, Text } from '@deriv/components';
import { formatMoney, getCurrencyName, routes } from '@deriv/shared';
import { localize } from '@deriv/translations';
import BalanceText from 'Components/elements/text/balance-text';
import CurrencySwitcherContainer from 'Components/containers/currency-switcher-container';
import { TRootStore } from 'Types';
import { useStores } from 'Stores/index';

const default_balance = { balance: 0, currency: 'USD' };

const RealAccountCard = () => {
    const history = useHistory();
    const store = useStores();
    const { client, modules, traders_hub }: TRootStore = store;

    const { accounts, loginid } = client;
    const { current_list } = modules.cfd;
    const { openModal, is_eu_user } = traders_hub;
    const { balance, currency } = accounts[loginid] || default_balance;

    const has_mf_mt5_account = Object.keys(current_list)
        .map(key => current_list[key])
        .some(account => account.landing_company_short === 'maltainvest');

    return (
        <CurrencySwitcherContainer
            className='demo-account-card'
            title={
                <Text size='xs' line_height='s'>
                    {getCurrencyName(currency)}
                </Text>
            }
            icon={currency}
            onClick={() => {
                if (!is_eu_user && !has_mf_mt5_account) {
                    openModal('currency_selection');
                }
                return openModal('currency_selection');
            }}
            actions={
                <Button
                    onClick={(e: MouseEvent) => {
                        e.stopPropagation();
                        history.push(routes.cashier_deposit);
                    }}
                    secondary
                    className='currency-switcher__button'
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
