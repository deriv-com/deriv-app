import React, { useCallback, useEffect } from 'react';
import { GetLimits } from '@deriv/api-types';
import { Text } from '@deriv/components';
import { useExchangeRate } from '@deriv/hooks';
import { getCurrencyDisplayCode } from '@deriv/shared';
import { Localize } from '@deriv/translations';

type TAccountTransferNoteProps = {
    allowed_transfers_amount: GetLimits['daily_cumulative_amount_transfers'];
    currency: string;
    is_crypto_to_crypto_transfer?: boolean;
    is_ctrader_transfer?: boolean;
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
    currency,
    is_ctrader_transfer,
    is_dxtrade_transfer,
    is_mt_transfer,
    minimum_fee,
    transfer_fee,
}: TAccountTransferNoteProps) => {
    const { handleSubscription, exchange_rates } = useExchangeRate();
    const account_currency = getCurrencyDisplayCode(currency);
    const exchange_rate = exchange_rates?.USD?.[account_currency] || 1;

    useEffect(() => {
        handleSubscription('USD', account_currency);
    }, [account_currency, exchange_rate, handleSubscription]);

    const getTransferFeeNote = useCallback(() => {
        if (transfer_fee === 2) {
            return (
                <Localize
                    i18n_default_text='We charge 2% or {{minimum_fee}} {{currency}} (whichever is higher) for all cryptocurrency transfers.'
                    values={{
                        minimum_fee,
                        currency: getCurrencyDisplayCode(currency),
                    }}
                />
            );
        } else if (transfer_fee === 1) {
            return (
                <Localize
                    i18n_default_text='We charge 1% or {{minimum_fee}} {{currency}} (whichever is higher) for all cryptocurrency transfers.'
                    values={{
                        minimum_fee,
                        currency: getCurrencyDisplayCode(currency),
                    }}
                />
            );
        }
        return (
            <Localize i18n_default_text='No fees for transfer between fiat account (with the same currency) to Deriv MT5, and Deriv X account(s), vice versa.' />
        );
    }, [currency, minimum_fee, transfer_fee]);

    const getPlatformsAllowedNotes = useCallback(() => {
        if (is_ctrader_transfer || is_dxtrade_transfer) {
            return (
                <React.Fragment>
                    <AccountTransferBullet>
                        <Localize
                            i18n_default_text='Each day you can transfer up to {{ allowed_dxtrade }} {{ currency }}. The daily limit will be reset at 00:00 GMT.'
                            values={{
                                allowed_dxtrade: (
                                    exchange_rate * (Number(allowed_transfers_amount?.dxtrade) || 50000)
                                ).toFixed(2),
                                currency: getCurrencyDisplayCode(currency),
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
                                    exchange_rate * (Number(allowed_transfers_amount?.mt5) || 200000)
                                ).toFixed(2),
                                currency: getCurrencyDisplayCode(currency),
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
                                exchange_rate * (Number(allowed_transfers_amount?.internal) || 100000)
                            ).toFixed(2),
                            currency: getCurrencyDisplayCode(currency),
                        }}
                    />
                </AccountTransferBullet>
            </React.Fragment>
        );
    }, [
        allowed_transfers_amount?.dxtrade,
        allowed_transfers_amount?.internal,
        allowed_transfers_amount?.mt5,
        currency,
        exchange_rate,
        is_ctrader_transfer,
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
