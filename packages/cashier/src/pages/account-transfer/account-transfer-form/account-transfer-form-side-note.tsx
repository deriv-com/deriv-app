import React, { useCallback } from 'react';
import { Localize } from '@deriv/translations';
import { GetLimits } from '@deriv/api-types';
import { Text } from '@deriv/components';
import { getCurrencyDisplayCode } from '@deriv/shared';
import { useExchangeRate } from '@deriv/hooks';

type TAccountTransferNoteProps = {
    allowed_transfers_amount: GetLimits['daily_cumulative_amount_transfers'];
    currency: string;
    is_crypto_to_crypto_transfer?: boolean;
    is_ctrader_transfer?: boolean;
    is_derivez_transfer?: boolean;
    is_dxtrade_allowed: boolean;
    is_dxtrade_transfer?: boolean;
    is_from_derivgo: boolean;
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
    is_derivez_transfer,
    is_dxtrade_transfer,
    is_from_derivgo,
    is_mt_transfer,
    minimum_fee,
    transfer_fee,
}: TAccountTransferNoteProps) => {
    const { getRate } = useExchangeRate();
    const account_currency = getCurrencyDisplayCode(currency);
    const exchange_rate = getRate(account_currency);

    //TODO: to refactor derivez notes once this account is used in deriv app and not only from derivgo

    const getFirstTransferFeeNote = useCallback(() => {
        if (transfer_fee === 1) {
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
            <Localize
                i18n_default_text='We charge 2% or {{minimum_fee}} {{currency}} (whichever is higher) for all cryptocurrency transfers.'
                values={{
                    minimum_fee,
                    currency: getCurrencyDisplayCode(currency),
                }}
            />
        );
    }, [currency, minimum_fee, transfer_fee]);

    const getSecondTransferFeeNote = () => {
        return (
            <Localize i18n_default_text='No fees for transfer between fiat account (with the same currency) to Deriv MT5, and Deriv X account(s), vice versa.' />
        );
    };

    const getDerivGoNotes = useCallback(() => {
        if (is_from_derivgo && is_derivez_transfer) {
            return (
                <React.Fragment>
                    <AccountTransferBullet>
                        <Localize
                            i18n_default_text='Each day you can transfer up to {{ allowed_derivez }} {{ currency }}. The daily limit will be reset at 00:00 GMT.'
                            values={{
                                allowed_derivez: (exchange_rate * Number(allowed_transfers_amount?.derivez)).toFixed(2),
                                currency: getCurrencyDisplayCode(currency),
                            }}
                        />
                    </AccountTransferBullet>
                </React.Fragment>
            );
        }

        return null;
    }, [allowed_transfers_amount?.derivez, currency, exchange_rate, is_derivez_transfer, is_from_derivgo]);

    const getPlatformsAllowedNotes = useCallback(() => {
        if (is_ctrader_transfer || is_dxtrade_transfer) {
            return (
                <React.Fragment>
                    <AccountTransferBullet>
                        <Localize
                            i18n_default_text='Each day you can transfer up to {{ allowed_dxtrade }} {{ currency }}. The daily limit will be reset at 00:00 GMT.'
                            values={{
                                allowed_dxtrade: (exchange_rate * Number(allowed_transfers_amount?.dxtrade)).toFixed(2),
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
                                allowed_mt5: (exchange_rate * Number(allowed_transfers_amount?.mt5)).toFixed(2),
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
                            allowed_internal: (exchange_rate * Number(allowed_transfers_amount?.internal)).toFixed(2),
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
            {getDerivGoNotes()}
            {getPlatformsAllowedNotes()}
            <AccountTransferBullet>
                <Localize i18n_default_text='Fees:' />
                <div className='account-transfer-form__notes-children'>
                    <AccountTransferBullet>{getFirstTransferFeeNote()}</AccountTransferBullet>
                    <AccountTransferBullet>{getSecondTransferFeeNote()}</AccountTransferBullet>
                </div>
            </AccountTransferBullet>
            <AccountTransferBullet>
                <Localize i18n_default_text='Transfers may be unavailable when the exchange market is closed or too volatile.' />
            </AccountTransferBullet>
        </div>
    );
};

export default AccountTransferNote;
