import React from 'react';
import { AppLinkedWithWalletIcon, Text, WalletIcon } from '@deriv/components';
import { useWalletTransactions } from '@deriv/hooks';
import { observer, useStore } from '@deriv/stores';
import { Localize } from '@deriv/translations';
import { getTradingAccountName, getWalletCurrencyIcon } from '@deriv/utils';

type TCompletedTransaction = {
    transaction: ReturnType<typeof useWalletTransactions>['transactions'][number];
};

const CompletedTransaction = observer(({ transaction }: TCompletedTransaction) => {
    const {
        ui: { is_dark_mode_on, is_mobile },
    } = useStore();

    const {
        account_category,
        account_currency_config,
        account_type,
        action_type,
        amount,
        balance_after = 0,
        is_virtual,
        landing_company_shortcode,
    } = transaction;

    const gradient_card_class = React.useMemo(
        () =>
            `wallet-card__${is_virtual === 1 ? 'demo' : account_currency_config?.code?.toLowerCase()}-bg${
                is_dark_mode_on ? '--dark' : ''
            }`,
        [is_virtual, account_currency_config, is_dark_mode_on]
    );

    const icon = React.useMemo(
        () => getWalletCurrencyIcon(is_virtual ? 'demo' : account_currency_config?.code || '', is_dark_mode_on, false),
        [is_virtual, account_currency_config, is_dark_mode_on]
    );

    const icon_type = React.useMemo(
        () => (is_virtual ? 'demo' : account_currency_config?.type),
        [is_virtual, account_currency_config]
    );

    const getAccountName = () => {
        return account_category === 'wallet'
            ? `${is_virtual ? 'Demo ' : ''}${account_currency_config?.code} Wallet`
            : getTradingAccountName(
                  account_type as 'standard' | 'mt5' | 'dxtrade' | 'binary',
                  !!is_virtual,
                  landing_company_shortcode
              );
    };

    const formatAmount = (value: number) =>
        value.toLocaleString(undefined, { minimumFractionDigits: account_currency_config?.fractional_digits });

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
        <div className='transaction-list__item' data-testid='dt_completed_transaction'>
            <div className='transaction-list__item__left'>
                {account_category === 'trading' ? (
                    <AppLinkedWithWalletIcon
                        app_icon={getAppIcon()}
                        gradient_class={gradient_card_class}
                        type={icon_type}
                        wallet_icon={icon}
                        hide_watermark
                    />
                ) : (
                    <WalletIcon
                        gradient_class={gradient_card_class}
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
                        {getAccountName()}
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
                    {(amount > 0 ? '+' : '') + formatAmount(amount)} {account_currency_config?.code}
                </Text>
                <Text
                    size={is_mobile ? 'xxxxs' : 'xxxs'}
                    color='less-prominent'
                    weight='lighter'
                    line_height={is_mobile ? 'm' : 's'}
                >
                    <Localize
                        i18n_default_text='Balance: {{amount}} {{currency_code}}'
                        values={{ amount: formatAmount(balance_after), currency_code: account_currency_config?.code }}
                    />
                </Text>
            </div>
        </div>
    );
});

export default CompletedTransaction;
