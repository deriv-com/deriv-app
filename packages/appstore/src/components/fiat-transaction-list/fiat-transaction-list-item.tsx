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
    account_name: string;
    currency: string;
    gradient_class: string;
    icon: string;
    icon_type: string;
    is_deriv_apps?: boolean;
};

const FiatTransactionListItem = ({
    account_name,
    action_type,
    amount,
    balance_after,
    currency,
    gradient_class,
    icon,
    icon_type,
    is_deriv_apps,
}: TFiatTransactionListItem) => {
    const {
        ui: { is_dark_mode_on, is_mobile },
    } = useStore();
    const formatAmount = (value: number) => value.toLocaleString(undefined, { minimumFractionDigits: 2 });

    const formatActionType = (value: string) => value[0].toUpperCase() + value.substring(1).replace(/_/, ' ');

    return (
        <div className='fiat-transaction-list__item'>
            <div className='fiat-transaction-list__item__left'>
                {is_deriv_apps ? (
                    <AppLinkedWithWalletIcon
                        app_icon={is_dark_mode_on ? 'IcWalletOptionsDark' : 'IcWalletOptionsLight'}
                        gradient_class={gradient_class}
                        type={icon_type}
                        wallet_icon={icon}
                        hide_watermark
                    />
                ) : (
                    <WalletIcon
                        gradient_class={gradient_class}
                        icon={icon}
                        type={icon_type}
                        has_bg
                        size='medium'
                        hide_watermark
                    />
                )}
                <div className='fiat-transaction-list__item__left__title'>
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
            <div className='fiat-transaction-list__item__right'>
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

export default FiatTransactionListItem;
