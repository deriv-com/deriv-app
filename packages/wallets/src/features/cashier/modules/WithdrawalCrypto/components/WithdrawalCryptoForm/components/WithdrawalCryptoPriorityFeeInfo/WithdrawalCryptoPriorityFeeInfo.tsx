import React from 'react';
import { Localize, useTranslations } from '@deriv-com/translations';
import { Text, Tooltip } from '@deriv-com/ui';
import { useWithdrawalCryptoContext } from '../../../../provider';
import './WithdrawalCryptoPriorityFeeInfo.scss';

const WithdrawalCryptoPriorityFeeInfo = ({ cryptoAmount }: { cryptoAmount: string }) => {
    const { activeWallet, countDownEstimationFee, cryptoEstimationsFee, fractionalDigits, serverTime } =
        useWithdrawalCryptoContext();
    const { localize } = useTranslations();

    return (
        <div className='wallets-withdrawal-crypto-form__priority-withdrawal-info'>
            <div className='wallets-withdrawal-crypto-form__priority-withdrawal-info--flex'>
                <Text as='div' size='sm'>
                    <Localize i18n_default_text='Withdrawal amount:' />
                </Text>
                <Text as='div' size='sm'>
                    {Number(cryptoAmount).toFixed(fractionalDigits.crypto as number)} {activeWallet?.currency}
                </Text>
            </div>
            <div className='wallets-withdrawal-crypto-form__priority-withdrawal-info--flex'>
                <Text as='div' size='sm'>
                    <Localize i18n_default_text='Transaction fee' />
                    <Text as='span' size='sm' weight='light'>
                        <Localize
                            i18n_default_text='({{countDownEstimationFee}}s)'
                            values={{ countDownEstimationFee }}
                        />
                    </Text>
                    :
                </Text>
                <Tooltip
                    as='div'
                    tooltipContent={localize('Fee calculated at {{serverTime}} GMT', { serverTime })}
                    tooltipPosition='top'
                >
                    <span className='wallets-withdrawal-crypto-form-underline'>
                        <Text as='div' size='sm'>
                            {cryptoEstimationsFee.toFixed(fractionalDigits.crypto as number)} {activeWallet?.currency}
                        </Text>
                    </span>
                </Tooltip>
            </div>
            <hr className='wallets-withdrawal-crypto-form__priority-withdrawal-info-divider' />
            <div className='wallets-withdrawal-crypto-form__priority-withdrawal-info--flex'>
                <Text as='div' size='sm'>
                    <Localize i18n_default_text='Amount received:' />
                </Text>
                <Text as='div' size='sm' weight='bold'>
                    {Number(cryptoAmount) > 0
                        ? (
                              parseFloat(Number(cryptoAmount).toFixed(fractionalDigits.crypto as number)) -
                              Number(cryptoEstimationsFee)
                          ).toFixed(fractionalDigits.crypto as number)
                        : Number(cryptoAmount).toFixed(fractionalDigits.crypto as number)}{' '}
                    {activeWallet?.currency}
                </Text>
            </div>
        </div>
    );
};

export default WithdrawalCryptoPriorityFeeInfo;
