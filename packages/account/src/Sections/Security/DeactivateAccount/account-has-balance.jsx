import React from 'react';
import { Button, Icon, Money, ThemedScrollbars } from '@deriv/components';
import { formatMoney } from '@deriv/shared';
import { localize } from '@deriv/translations';

// TODO: [move-to-shared] - Remove the implementation in Client and add this to shared utils
const getMT5AccountType = (group) => (group ? group.replace('\\', '_').replace(/_(\d+|master|EUR|GBP)/, '') : '');

// TODO: [move-to-shared] - Remove the implementation in Client and add this to shared utils
const getMT5AccountDisplay = (group) => {
    if (!group) return {};

    const value = getMT5AccountType(group);
    let display_text = localize('MT5');
    if (/svg$/.test(value)) {
        display_text = localize('Synthetic');
    } else if (/vanuatu/.test(value) || /svg_(standard|financial)/.test(value)) {
        display_text = localize('Financial');
    } else if (/labuan/.test(value)) {
        display_text = localize('Financial STP');
    }

    return display_text;
};

const AccountHasBalanceOrOpenPositions = ({
    accounts_with_balance_or_open_positions,
    mt5_login_list,
    client_accounts,
    onBackClick,
}) => {
    const deriv_accounts_open_positions = [];
    const deriv_accounts_with_balance = [];
    const mt5_accounts_id = [];
    const mt5_accounts_with_balance_or_open_positions = [];
    const isActiveAccount = (client_account, account_name) => client_account.loginid === account_name;

    if (accounts_with_balance_or_open_positions.open_positions) {
        Object.keys(accounts_with_balance_or_open_positions.open_positions).forEach((account_name) => {
            const deriv_account_with_open_position = client_accounts.find((client_account) =>
                isActiveAccount(client_account, account_name)
            );
            if (deriv_account_with_open_position) {
                deriv_accounts_open_positions.push(deriv_account_with_open_position);
            } else {
                mt5_accounts_id.push(account_name);
            }
        });
    }
    if (accounts_with_balance_or_open_positions.balance) {
        Object.keys(accounts_with_balance_or_open_positions.balance).forEach((account_name) => {
            const is_deriv_account = client_accounts.find((client_account) =>
                isActiveAccount(client_account, account_name)
            );
            if (is_deriv_account) {
                const deriv_account = accounts_with_balance_or_open_positions.balance[account_name];
                deriv_account.id = account_name;
                deriv_accounts_with_balance.push(deriv_account);
            } else {
                mt5_accounts_id.push(account_name);
            }
        });
    }
    if (mt5_accounts_id.length !== 0) {
        [...new Set(mt5_accounts_id)].forEach((account_name) => {
            const mt5_account_with_balance = mt5_login_list.find((account_obj) => account_obj.login === account_name);
            if (mt5_account_with_balance) {
                mt5_accounts_with_balance_or_open_positions.push(mt5_account_with_balance);
            }
        });
    }
    return (
        <ThemedScrollbars className='have-open-positions-or-balance-scroll'>
            {!!deriv_accounts_open_positions.length && (
                <div className='have-open-positions-or-balance'>
                    <p className='have-open-positions-or-balance__title'>
                        {localize('You have open positions in these Deriv accounts:')}
                    </p>
                    {deriv_accounts_open_positions.map((account) => (
                        <div key={account.loginid} className='have-open-positions-or-balance__accounts-wrapper'>
                            <Icon icon={`IcCurrency-${account.title.toLowerCase()}`} size={24} />
                            <div className='have-open-positions-or-balance__accounts-data'>
                                <span className='have-open-positions-or-balance__accounts-currency'>
                                    {account.title}
                                </span>
                                <span className='have-open-positions-or-balance__accounts-loginid'>
                                    {account.loginid}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {!!deriv_accounts_with_balance.length && (
                <div className='have-open-positions-or-balance'>
                    <p className='have-open-positions-or-balance__title'>
                        {localize('You have funds in these Deriv accounts:')}
                    </p>
                    {deriv_accounts_with_balance.map((account) => (
                        <div key={account.id}>
                            {account.currency && (
                                <div className='have-open-positions-or-balance__container'>
                                    <div className='have-open-positions-or-balance__account-details'>
                                        <div className='have-open-positions-or-balance__account-details__icon'>
                                            <Icon icon={`IcCurrency-${account.currency.toLowerCase()}`} size={24} />
                                        </div>
                                        <div className='have-open-positions-or-balance__balance'>
                                            <span className='have-open-positions-or-balance__accounts-currency'>
                                                {account.currency}
                                            </span>
                                            <span className='have-open-positions-or-balance__accounts-loginid'>
                                                {account.id}
                                            </span>
                                        </div>
                                    </div>
                                    <div className='have-open-positions-or-balance__money'>
                                        <Money
                                            currency={account.currency}
                                            amount={formatMoney(account.currency, account.balance, true)}
                                            should_format={false}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
            {!!mt5_accounts_with_balance_or_open_positions.length && (
                <div className='have-open-positions-or-balance'>
                    <p className='have-open-positions-or-balance__title'>
                        {localize('You have funds or open positions in these DMT5 accounts:')}
                    </p>
                    {mt5_accounts_with_balance_or_open_positions.map((account) => (
                        <div key={account.login} className='have-open-positions-or-balance__container'>
                            <div className='have-open-positions-or-balance__account-details'>
                                <div className='have-open-positions-or-balance__container__account-details__icon'>
                                    <Icon icon={`IcMt5-${getMT5AccountDisplay(account.group)}`} size={24} />
                                </div>
                                <div className='have-open-positions-or-balance__balance'>
                                    <span className='have-open-positions-or-balance__balance--currency'>
                                        {getMT5AccountDisplay(account.group)}
                                    </span>
                                    <span className='have-open-positions-or-balance__balance--id'>
                                        {account.login.replace('MTR', '')}
                                    </span>
                                </div>
                            </div>
                            <div className='have-open-positions-or-balance__money'>
                                <Money
                                    currency={account.currency}
                                    amount={formatMoney(account.currency, account.balance, true)}
                                    should_format={false}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            )}
            <div>
                <Button className='have-open-positions-or-balance__button' primary onClick={onBackClick}>
                    {localize('OK')}
                </Button>
            </div>
        </ThemedScrollbars>
    );
};

export default AccountHasBalanceOrOpenPositions;
