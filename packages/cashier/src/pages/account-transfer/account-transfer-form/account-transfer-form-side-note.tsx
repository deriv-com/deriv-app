import React, { useCallback, useEffect } from 'react';
import { GetLimits } from '@deriv/api-types';
import { Text } from '@deriv/components';
import { useExchangeRate } from '@deriv/hooks';
import { Localize } from '@deriv/translations';
import { useCurrencyConfig } from '@deriv/api';
import { addComma, getPlatformSettings } from '@deriv/shared';

type TAccountTransferNoteProps = {
    allowed_transfers_amount: GetLimits['daily_cumulative_amount_transfers'];
    allowed_transfers_count: GetLimits['daily_transfers'];
    currency: string;
    is_cumulative_transfers_enabled: boolean;
    is_dxtrade_allowed: boolean;
    is_dxtrade_transfer?: boolean;
    is_mt_transfer?: boolean;
    minimum_fee: string | null;
    transfer_fee?: number | null;
};

const AccountTransferBullet = ({ children }: React.PropsWithChildren) => (
    <div className='account-transfer-form__bullet-wrapper'>
        <div className='account-transfer-form__bullet' />
        <Text size='xxs'>{children}</Text>
    </div>
);

const AccountTransferNote = ({
    allowed_transfers_amount,
    allowed_transfers_count,
    currency,
    is_cumulative_transfers_enabled,
    is_dxtrade_allowed,
    is_dxtrade_transfer,
    is_mt_transfer,
    minimum_fee,
    transfer_fee,
}: TAccountTransferNoteProps) => {
    const { handleSubscription, exchange_rates } = useExchangeRate();
    const { getConfig } = useCurrencyConfig();
    const currency_config = getConfig(currency);
    const account_currency = currency_config?.display_code;
    const exchange_rate = account_currency != null ? exchange_rates?.USD?.[account_currency] || 1 : 1;
    const platform_name_dxtrade = getPlatformSettings('dxtrade').name;
    const platform_name_mt5 = getPlatformSettings('mt5').name;
    const platform_name_ctrader = getPlatformSettings('ctrader').name;

    useEffect(() => {
        if (account_currency) {
            handleSubscription('USD', account_currency);
        }
    }, [account_currency, exchange_rate, handleSubscription]);

    const getTransferFeeNote = useCallback(() => {
        if (transfer_fee === 2) {
            return (
                <AccountTransferBullet>
                    <Localize
                        i18n_default_text='We charge 2% or {{ minimum_fee }} {{ currency }} (whichever is higher) for all cryptocurrency transfers.'
                        values={{
                            minimum_fee,
                            currency: account_currency,
                        }}
                    />
                </AccountTransferBullet>
            );
        } else if (transfer_fee === 1) {
            return (
                <AccountTransferBullet>
                    <Localize
                        i18n_default_text='We charge 1% or {{ minimum_fee }} {{ currency }} (whichever is higher) for all cryptocurrency transfers.'
                        values={{
                            minimum_fee,
                            currency: account_currency,
                        }}
                    />
                </AccountTransferBullet>
            );
        }
        return (
            <AccountTransferBullet>
                <Localize
                    i18n_default_text="We don't charge a fee for transferring funds between your Deriv {{currency}} account to Deriv MT5, Deriv cTrader, or Deriv X account."
                    values={{
                        currency: account_currency,
                    }}
                />
            </AccountTransferBullet>
        );
    }, [account_currency, minimum_fee, transfer_fee]);

    const getDailyCumilativeLimitNotes = useCallback(() => {
        if (is_dxtrade_transfer) {
            return (
                <AccountTransferBullet>
                    <Localize
                        i18n_default_text='Each day you can transfer up to {{ allowed_dxtrade }} {{ currency }}. The daily limit will be reset at 00:00 GMT.'
                        values={{
                            allowed_dxtrade: addComma(
                                exchange_rate * Number(allowed_transfers_amount?.dxtrade),
                                2,
                                false
                            ),
                            currency: account_currency,
                        }}
                    />
                </AccountTransferBullet>
            );
        } else if (is_mt_transfer) {
            return (
                <AccountTransferBullet>
                    <Localize
                        i18n_default_text='Each day you can transfer up to {{ allowed_mt5 }} {{ currency }}. The daily limit will be reset at 00:00 GMT.'
                        values={{
                            allowed_mt5: addComma(exchange_rate * Number(allowed_transfers_amount?.mt5), 2, false),
                            currency: account_currency,
                        }}
                    />
                </AccountTransferBullet>
            );
        }
        return (
            <AccountTransferBullet>
                <Localize
                    i18n_default_text='Each day you can transfer up to {{ allowed_internal }} {{ currency }}. The daily limit will be reset at 00:00 GMT.'
                    values={{
                        allowed_internal: addComma(
                            exchange_rate * Number(allowed_transfers_amount?.internal),
                            2,
                            false
                        ),
                        currency: account_currency,
                    }}
                />
            </AccountTransferBullet>
        );
    }, [
        account_currency,
        allowed_transfers_amount?.dxtrade,
        allowed_transfers_amount?.internal,
        allowed_transfers_amount?.mt5,
        exchange_rate,
        is_dxtrade_transfer,
        is_mt_transfer,
    ]);

    const getDailyCountTransferNotes = useCallback(() => {
        if (is_dxtrade_allowed) {
            return (
                <AccountTransferBullet>
                    <Localize
                        i18n_default_text='Each day, you can make up to {{ allowed_internal }} transfers between your Deriv accounts, up to {{ allowed_mt5 }} transfers between your Deriv and {{platform_name_mt5}} accounts, up to {{ allowed_ctrader }} transfers between your Deriv and {{platform_name_ctrader}} accounts, and up to {{ allowed_dxtrade }} transfers between your Deriv and {{platform_name_dxtrade}} accounts.'
                        values={{
                            allowed_internal: allowed_transfers_count?.internal,
                            allowed_mt5: allowed_transfers_count?.mt5,
                            allowed_dxtrade: allowed_transfers_count?.dxtrade,
                            allowed_ctrader: allowed_transfers_count?.ctrader,
                            platform_name_dxtrade,
                            platform_name_mt5,
                            platform_name_ctrader,
                        }}
                    />
                </AccountTransferBullet>
            );
        }
        return (
            <AccountTransferBullet>
                <Localize
                    i18n_default_text='Each day, you can make up to {{ allowed_internal }} transfers between your Deriv accounts and up to {{ allowed_mt5 }} transfers between your Deriv and {{platform_name_mt5}} accounts.'
                    values={{
                        allowed_internal: allowed_transfers_count?.internal,
                        allowed_mt5: allowed_transfers_count?.mt5,
                        platform_name_mt5,
                    }}
                />
            </AccountTransferBullet>
        );
    }, [
        allowed_transfers_count?.ctrader,
        allowed_transfers_count?.dxtrade,
        allowed_transfers_count?.internal,
        allowed_transfers_count?.mt5,
        is_dxtrade_allowed,
        platform_name_ctrader,
        platform_name_dxtrade,
        platform_name_mt5,
    ]);

    return (
        <div className='account-transfer-form__notes'>
            {is_cumulative_transfers_enabled && getDailyCumilativeLimitNotes()}
            {!is_cumulative_transfers_enabled && getDailyCountTransferNotes()}
            {getTransferFeeNote()}
            <AccountTransferBullet>
                <Localize i18n_default_text='Transfers may be unavailable when the exchange market is closed or too volatile.' />
            </AccountTransferBullet>
        </div>
    );
};

export default AccountTransferNote;
