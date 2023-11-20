import React, { useCallback } from 'react';
import { Localize } from '@deriv/translations';
import { GetLimits } from '@deriv/api-types';
import { Text } from '@deriv/components';
import { getCurrencyDisplayCode, getPlatformSettings } from '@deriv/shared';
import { useCashierStore } from '../../../stores/useCashierStores';

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
    is_derivez_transfer,
    is_dxtrade_allowed,
    is_from_derivgo,
    minimum_fee,
}: TAccountTransferNoteProps) => {
    const { general_store } = useCashierStore();
    const { is_crypto } = general_store;
    const platform_name_dxtrade = getPlatformSettings('dxtrade').name;
    const platform_name_mt5 = getPlatformSettings('mt5').name;
    const platform_name_derivez = getPlatformSettings('derivez').name;
    const platform_name_ctrader = getPlatformSettings('ctrader').name;

    //TODO: to refactor derivez notes once this account is used in deriv app and not only from derivgo

    const getTransferFeeNote = useCallback(() => {
        return (
            <Localize
                i18n_default_text='We charge 2% or {{minimum_fee}} {{currency}} (whichever is higher) for all cryptocurrency transfers.'
                values={{
                    minimum_fee,
                    currency: !is_crypto ? 'USD' : getCurrencyDisplayCode(currency),
                }}
            />
        );
    }, [currency, is_crypto, minimum_fee]);

    const getNoTransferFeeNote = useCallback(() => {
        return (
            <Localize
                i18n_default_text='No fees for transfer between {{ currency }} account to Deriv MT5, and Deriv X account(s), vice versa.'
                values={{
                    currency: is_crypto ? 'USD' : getCurrencyDisplayCode(currency),
                }}
            />
        );
    }, [currency, is_crypto]);

    const getDerivGoNotes = useCallback(() => {
        if (is_from_derivgo && is_derivez_transfer) {
            return (
                <React.Fragment>
                    <AccountTransferBullet>
                        <Localize
                            i18n_default_text='Each day you can transfer up to {{ allowed_derivez }} USD. The daily limit will be reset at 00:00 GMT.'
                            values={{
                                allowed_derivez: allowed_transfers_amount?.derivez,
                                platform_name_dxtrade,
                                platform_name_mt5,
                                platform_name_derivez,
                            }}
                        />
                    </AccountTransferBullet>
                </React.Fragment>
            );
        }

        return null;
    }, [
        allowed_transfers_amount?.derivez,
        is_derivez_transfer,
        is_from_derivgo,
        platform_name_derivez,
        platform_name_dxtrade,
        platform_name_mt5,
    ]);

    const getDxtradeAllowedNotes = useCallback(() => {
        if (is_dxtrade_allowed) {
            return (
                <React.Fragment>
                    <AccountTransferBullet>
                        <Localize
                            i18n_default_text='Each day you can transfer up to {{ allowed_dxtrade }} USD. The daily limit will be reset at 00:00 GMT.'
                            values={{
                                allowed_dxtrade: allowed_transfers_amount?.dxtrade,
                                platform_name_dxtrade,
                                platform_name_mt5,
                                platform_name_ctrader,
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
                        i18n_default_text='Each day you can transfer up to {{ allowed_mt5 }} USD. The daily limit will be reset at 00:00 GMT.'
                        values={{
                            allowed_mt5: allowed_transfers_amount?.mt5,
                            platform_name_mt5,
                        }}
                    />
                </AccountTransferBullet>
            </React.Fragment>
        );
    }, [
        allowed_transfers_amount?.dxtrade,
        allowed_transfers_amount?.mt5,
        is_dxtrade_allowed,
        platform_name_dxtrade,
        platform_name_mt5,
        platform_name_ctrader,
    ]);

    return (
        <div className='account-transfer-form__notes'>
            {getDerivGoNotes()}
            {getDxtradeAllowedNotes()}
            <AccountTransferBullet>
                <Localize i18n_default_text='Fees:' />
                <div className='account-transfer-form__notes-children'>
                    <AccountTransferBullet>{getTransferFeeNote()}</AccountTransferBullet>
                    <AccountTransferBullet>{getNoTransferFeeNote()}</AccountTransferBullet>
                </div>
            </AccountTransferBullet>
            <AccountTransferBullet>
                <Localize i18n_default_text='Transfers may be unavailable when the exchange market is closed or too volatile.' />
            </AccountTransferBullet>
        </div>
    );
};

export default AccountTransferNote;
