import React, { useCallback, useEffect } from 'react';
import { GetLimits } from '@deriv/api-types';
import { Text } from '@deriv/components';
import { useExchangeRate } from '@deriv/hooks';
import { Localize } from '@deriv/translations';
import { useCurrencyConfig } from '@deriv/api';

type TAccountTransferNoteProps = {
    allowed_transfers_amount: GetLimits['daily_cumulative_amount_transfers'];
    currency: string;
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

const ALLOWED_TRANSFER_AMOUNTS = { DXTRADE: 50000, INTERNAL: 100000, MT5: 200000 };

const AccountTransferNote = ({
    allowed_transfers_amount,
    currency,
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

    useEffect(() => {
        handleSubscription('USD', JSON.stringify(account_currency));
    }, [account_currency, exchange_rate, handleSubscription]);

    const getTransferFeeNote = useCallback(() => {
        if (transfer_fee === 2) {
            return (
                <Localize
                    i18n_default_text='We charge 2% or {{minimum_fee}} {{currency}} (whichever is higher) for all cryptocurrency transfers.'
                    values={{
                        minimum_fee,
                        currency: account_currency,
                    }}
                />
            );
        } else if (transfer_fee === 1) {
            return (
                <Localize
                    i18n_default_text='We charge 1% or {{minimum_fee}} {{currency}} (whichever is higher) for all cryptocurrency transfers.'
                    values={{
                        minimum_fee,
                        currency: account_currency,
                    }}
                />
            );
        }
        return (
            <Localize i18n_default_text='No fees for transfer between fiat account (with the same currency) to Deriv MT5, and Deriv X account(s), vice versa.' />
        );
    }, [account_currency, minimum_fee, transfer_fee]);

    const getPlatformsAllowedNotes = useCallback(() => {
        if (is_dxtrade_transfer) {
            return (
                <React.Fragment>
                    <AccountTransferBullet>
                        <Localize
                            i18n_default_text='Each day you can transfer up to {{ allowed_dxtrade }} {{ currency }}. The daily limit will be reset at 00:00 GMT.'
                            values={{
                                allowed_dxtrade: (
                                    exchange_rate *
                                    (Number(allowed_transfers_amount?.dxtrade) || ALLOWED_TRANSFER_AMOUNTS.DXTRADE)
                                )
                                    .toFixed(2)
                                    .toString()
                                    .replace(/\B(?=(\d{3})+(?!\d))/g, ','),
                                currency: account_currency,
                            }}
                        />
                    </AccountTransferBullet>
                </React.Fragment>
            );
        } else if (is_mt_transfer) {
            return (
                <React.Fragment>
                    <AccountTransferBullet>
                        <Localize
                            i18n_default_text='Each day you can transfer up to {{ allowed_mt5 }} {{ currency }}. The daily limit will be reset at 00:00 GMT.'
                            values={{
                                allowed_mt5: (
                                    exchange_rate *
                                    (Number(allowed_transfers_amount?.mt5) || ALLOWED_TRANSFER_AMOUNTS.MT5)
                                )
                                    .toFixed(2)
                                    .toString()
                                    .replace(/\B(?=(\d{3})+(?!\d))/g, ','),
                                currency: account_currency,
                            }}
                        />
                    </AccountTransferBullet>
                </React.Fragment>
            );
        }
        return (
            <React.Fragment>
                <AccountTransferBullet>
                    <Localize
                        i18n_default_text='Each day you can transfer up to {{ allowed_internal }} {{ currency }}. The daily limit will be reset at 00:00 GMT.'
                        values={{
                            allowed_internal: (
                                exchange_rate *
                                (Number(allowed_transfers_amount?.internal) || ALLOWED_TRANSFER_AMOUNTS.INTERNAL)
                            )
                                .toFixed(2)
                                .toString()
                                .replace(/\B(?=(\d{3})+(?!\d))/g, ','),
                            currency: account_currency,
                        }}
                    />
                </AccountTransferBullet>
            </React.Fragment>
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

    return (
        <div className='account-transfer-form__notes'>
            {getPlatformsAllowedNotes()}
            <AccountTransferBullet>{getTransferFeeNote()}</AccountTransferBullet>
            <AccountTransferBullet>
                <Localize i18n_default_text='Transfers may be unavailable when the exchange market is closed or too volatile.' />
            </AccountTransferBullet>
        </div>
    );
};

export default AccountTransferNote;
