import React from 'react';
import { Localize } from '@deriv/translations';
import { GetLimits } from '@deriv/api-types';
import { DesktopWrapper, Text } from '@deriv/components';
import { getCurrencyDisplayCode, getPlatformSettings } from '@deriv/shared';
import { TReactChildren } from 'Types';

type TAccountTransferBulletProps = {
    children: TReactChildren;
};

type TAccountTransferNoteProps = {
    allowed_transfers_count: GetLimits['daily_transfers'];
    currency: string;
    is_crypto_to_crypto_transfer: boolean;
    is_dxtrade_allowed: boolean;
    is_dxtrade_transfer: boolean;
    is_mt_transfer: boolean;
    minimum_fee: string | number;
    transfer_fee: string | number;
};

const AccountTransferBullet = ({ children }: TAccountTransferBulletProps) => (
    <div className='account-transfer-form__bullet-wrapper'>
        <div className='account-transfer-form__bullet' />
        <Text size='xxs'>{children}</Text>
    </div>
);

const AccountTransferNote = ({
    allowed_transfers_count,
    currency,
    is_crypto_to_crypto_transfer,
    is_dxtrade_allowed,
    is_dxtrade_transfer,
    is_mt_transfer,
    minimum_fee,
    transfer_fee,
}: TAccountTransferNoteProps) => {
    const platform_name_dxtrade = getPlatformSettings('dxtrade').name;
    const platform_name_mt5 = getPlatformSettings('mt5').name;

    const getTransferFeeNote = () => {
        if (transfer_fee === 0) {
            return is_dxtrade_allowed ? (
                <Localize
                    i18n_default_text='We do not charge a transfer fee for transfers in the same currency between your Deriv fiat and {{platform_name_mt5}} accounts and between your Deriv fiat and {{platform_name_dxtrade}} accounts.'
                    values={{ platform_name_dxtrade, platform_name_mt5 }}
                />
            ) : (
                <Localize
                    i18n_default_text='You’ll not be charged a transfer fee for transfers in the same currency between your Deriv fiat and {{platform_name_mt5}} accounts.'
                    values={{ platform_name_mt5 }}
                />
            );
        } else if (transfer_fee === 1) {
            return is_dxtrade_allowed ? (
                <Localize
                    i18n_default_text='We’ll charge a 1% transfer fee for transfers in different currencies between your Deriv fiat and {{platform_name_mt5}} accounts and between your Deriv fiat and {{platform_name_dxtrade}} accounts.'
                    values={{ platform_name_dxtrade, platform_name_mt5 }}
                />
            ) : (
                <Localize
                    i18n_default_text='We’ll charge a 1% transfer fee for transfers in different currencies between your Deriv fiat and {{platform_name_mt5}} accounts.'
                    values={{ platform_name_mt5 }}
                />
            );
        } else if (transfer_fee === 2 && is_crypto_to_crypto_transfer) {
            return (
                <Localize
                    i18n_default_text='We’ll charge a 2% transfer fee or {{minimum_fee}} {{currency}}, whichever is higher, for transfers between your Deriv cryptocurrency accounts.'
                    values={{
                        minimum_fee,
                        currency: getCurrencyDisplayCode(currency),
                    }}
                />
            );
        } else if (transfer_fee === 2 && (is_mt_transfer || is_dxtrade_transfer)) {
            return is_dxtrade_allowed ? (
                <Localize
                    i18n_default_text='We’ll charge a 2% transfer fee or {{minimum_fee}} {{currency}}, whichever is higher, for transfers between your Deriv cryptocurrency and Deriv MT5 accounts and between your Deriv cryptocurrency and {{platform_name_dxtrade}} accounts.'
                    values={{
                        minimum_fee,
                        currency: getCurrencyDisplayCode(currency),
                        platform_name_dxtrade,
                    }}
                />
            ) : (
                <Localize
                    i18n_default_text='We’ll charge a 2% transfer fee or {{minimum_fee}} {{currency}}, whichever is higher, for transfers between your Deriv cryptocurrency and Deriv MT5 accounts.'
                    values={{
                        minimum_fee,
                        currency: getCurrencyDisplayCode(currency),
                    }}
                />
            );
        } else if (transfer_fee === 2 && !is_mt_transfer && !is_dxtrade_transfer) {
            return (
                <Localize
                    i18n_default_text='We’ll charge a 2% transfer fee or {{minimum_fee}} {{currency}}, whichever is higher, for transfers between your Deriv fiat and Deriv cryptocurrency accounts.'
                    values={{
                        minimum_fee,
                        currency: getCurrencyDisplayCode(currency),
                    }}
                />
            );
        }
        return null;
    };

    return (
        <div className='account-transfer-form__notes'>
            <AccountTransferBullet>
                {is_dxtrade_allowed ? (
                    <Localize
                        i18n_default_text='You may transfer between your Deriv fiat, cryptocurrency, {{platform_name_mt5}}, and {{platform_name_dxtrade}} accounts.'
                        values={{ platform_name_dxtrade, platform_name_mt5 }}
                    />
                ) : (
                    <Localize
                        i18n_default_text='You may transfer between your Deriv fiat, cryptocurrency, and {{platform_name_mt5}} accounts.'
                        values={{ platform_name_mt5 }}
                    />
                )}
            </AccountTransferBullet>
            <AccountTransferBullet>
                {is_dxtrade_allowed ? (
                    <Localize
                        i18n_default_text='Each day, you can make up to {{ allowed_internal }} transfers between your Deriv accounts, up to {{ allowed_mt5 }} transfers between your Deriv and {{platform_name_mt5}} accounts, and up to {{ allowed_dxtrade }} transfers between your Deriv and {{platform_name_dxtrade}} accounts.'
                        values={{
                            allowed_internal: allowed_transfers_count?.internal,
                            allowed_mt5: allowed_transfers_count?.mt5,
                            allowed_dxtrade: allowed_transfers_count?.dxtrade,
                            platform_name_dxtrade,
                            platform_name_mt5,
                        }}
                    />
                ) : (
                    <Localize
                        i18n_default_text='Each day, you can make up to {{ allowed_internal }} transfers between your Deriv accounts and up to {{ allowed_mt5 }} transfers between your Deriv and {{platform_name_mt5}} accounts.'
                        values={{
                            allowed_internal: allowed_transfers_count?.internal,
                            allowed_mt5: allowed_transfers_count?.mt5,
                            platform_name_mt5,
                        }}
                    />
                )}
            </AccountTransferBullet>
            <AccountTransferBullet>
                <Localize i18n_default_text='Transfer limits may vary depending on the exchange rates.' />
            </AccountTransferBullet>
            <AccountTransferBullet>
                {getTransferFeeNote()}{' '}
                <Localize i18n_default_text='Please bear in mind that some transfers may not be possible.' />
            </AccountTransferBullet>
            <AccountTransferBullet>
                <Localize i18n_default_text='Transfers may be unavailable due to high volatility or technical issues and when the exchange markets are closed.' />
            </AccountTransferBullet>
        </div>
    );
};

export default AccountTransferNote;
