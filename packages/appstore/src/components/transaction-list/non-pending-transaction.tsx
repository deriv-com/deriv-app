import React from 'react';
import { Statement } from '@deriv/api-types';
import { useStore } from '@deriv/stores';
import { AppLinkedWithWalletIcon, Text, WalletIcon } from '@deriv/components';

type TStatementTransaction = DeepRequired<Statement>['transactions'][number];

type TFiatTransactionListItem = Pick<TStatementTransaction, 'amount' | 'balance_after'> & {
    action_type:
        | (TStatementTransaction['action_type'] & ('deposit' | 'withdrawal' | 'transfer'))
        | 'initial_fund'
        | 'reset_balance';
    account_category?: string;
    account_currency: string;
    account_name: string;
    account_type?: string;
    currency: string;
    icon: string;
    icon_type: string;
};

const NonPendingTransaction = ({
    account_category,
    account_currency,
    account_name,
    account_type,
    action_type,
    amount,
    balance_after,
    currency,
    icon,
    icon_type,
}: TFiatTransactionListItem) => {
    const {
        ui: { is_dark_mode_on, is_mobile },
    } = useStore();
    const formatAmount = (value: number) => value.toLocaleString(undefined, { minimumFractionDigits: 2 });

    const formatActionType = (value: string) => value[0].toUpperCase() + value.substring(1).replace(/_/, ' ');

    const getAppIcon = () => {
        switch (account_type) {
            case 'standard':
                return is_dark_mode_on ? 'IcWalletOptionsDark' : 'IcWalletOptionsLight';
            case 'mt5':
                return 'IcMt5CfdPlatform';
            case 'dxtrade':
                return '';
            default:
                return '';
        }
    };

    return (
        <div className='transaction-list__item'>
            <div className='transaction-list__item__left'>
                {account_category === 'trading' ? (
                    <AppLinkedWithWalletIcon
                        app_icon={getAppIcon()}
                        currency={account_currency}
                        type={icon_type}
                        wallet_icon={icon}
                    />
                ) : (
                    <WalletIcon currency={account_currency} icon={icon} type={icon_type} has_bg size='medium' />
                )}
                <div className='transaction-list__item__left__title'>
                    <Text
                        size={is_mobile ? 'xxxs' : 'xxs'}
                        color='less-prominent'
                        weight='lighter'
                        line_height={is_mobile ? 's' : 'm'}
                    >
                        {formatActionType(action_type)}
                    </Text>
                    <Text
                        size={is_mobile ? 'xxxs' : 'xxs'}
                        color='prominent'
                        weight='bold'
                        line_height={is_mobile ? 's' : 'm'}
                    >
                        {account_name}
                    </Text>
                </div>
            </div>
            <div className='transaction-list__item__right'>
                <Text
                    size={is_mobile ? 'xxxs' : 'xxs'}
                    color={amount > 0 ? 'profit-success' : 'loss-danger'}
                    weight='bold'
                    line_height={is_mobile ? 's' : 'm'}
                >
                    {(amount > 0 ? '+' : '') + formatAmount(amount)} {currency}
                </Text>
                <Text
                    size={is_mobile ? 'xxxxs' : 'xxxs'}
                    color='less-prominent'
                    weight='lighter'
                    line_height={is_mobile ? 'm' : 's'}
                >
                    Balance: {formatAmount(balance_after)} {currency}
                </Text>
            </div>
        </div>
    );
};

export default NonPendingTransaction;
