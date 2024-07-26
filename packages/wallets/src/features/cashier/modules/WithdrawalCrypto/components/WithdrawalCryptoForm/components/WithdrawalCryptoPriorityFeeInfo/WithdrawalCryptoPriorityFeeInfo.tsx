import React, { useRef } from 'react';
import { useHover } from 'usehooks-ts';
import { Localize } from '@deriv-com/translations';
import { Text } from '@deriv-com/ui';
import { Tooltip } from '../../../../../../../../components';
import { useWithdrawalCryptoContext } from '../../../../provider';
import './WithdrawalCryptoPriorityFeeInfo.scss';

const WithdrawalCryptoPriorityFeeInfo = ({ cryptoAmount }: { cryptoAmount: string }) => {
    const { activeWallet, countDownEstimationFee, cryptoEstimationsFee, fractionalDigits, serverTime } =
        useWithdrawalCryptoContext();
    const hoverRef = useRef(null);
    const isHovered = useHover(hoverRef);

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
                <Tooltip alignment='top' isVisible={isHovered} message={`Fee calculated at ${serverTime} GMT`}>
                    <span className='wallets-withdrawal-crypto-form-underline' ref={hoverRef}>
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
