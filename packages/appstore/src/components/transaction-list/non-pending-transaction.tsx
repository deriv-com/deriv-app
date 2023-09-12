import React from 'react';
import { AppLinkedWithWalletIcon, Text, WalletIcon } from '@deriv/components';
import { useWalletTransactions } from '@deriv/hooks';
import { useStore } from '@deriv/stores';
import { Localize } from '@deriv/translations';

type TNonPendingTransaction = {
    transaction: ReturnType<typeof useWalletTransactions>['transactions'][number];
};

const NonPendingTransaction = ({ transaction }: TNonPendingTransaction) => {
    const {
        ui: { is_dark_mode_on, is_mobile },
    } = useStore();

    const {
        account_category,
        account_currency,
        account_name,
        account_type,
        action_type,
        amount,
        balance_after = 0,
        gradient_class,
        icon,
        icon_type,
    } = transaction;

    const formatAmount = (value: number) => value.toLocaleString(undefined, { minimumFractionDigits: 2 });

    const formatActionType = (value: string) => value[0].toUpperCase() + value.substring(1).replace(/_/, ' ');

    const getAppIcon = () => {
        switch (account_type) {
            case 'standard':
                return is_dark_mode_on ? 'IcWalletOptionsDark' : 'IcWalletOptionsLight';
            //TODO: add proper icon for mt5
            case 'mt5':
                return 'IcMt5CfdPlatform';
            //TODO: add proper icon for dxtrade
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
                    {(amount > 0 ? '+' : '') + formatAmount(amount)} {account_currency}
                </Text>
                <Text
                    size={is_mobile ? 'xxxxs' : 'xxxs'}
                    color='less-prominent'
                    weight='lighter'
                    line_height={is_mobile ? 'm' : 's'}
                >
                    <Localize
                        i18n_default_text='Balance: {{balance}} {{currency}}'
                        values={{
                            balance: formatAmount(balance_after),
                            currency: account_currency,
                        }}
                    />
                </Text>
            </div>
        </div>
    );
};

export default NonPendingTransaction;
