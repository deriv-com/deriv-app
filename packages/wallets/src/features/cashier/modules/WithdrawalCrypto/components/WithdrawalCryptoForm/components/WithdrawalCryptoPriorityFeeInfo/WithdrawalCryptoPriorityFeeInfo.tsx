import React, { useRef } from 'react';
import { useHover } from 'usehooks-ts';
import { Tooltip, WalletText } from '../../../../../../../../components';
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
                <WalletText as='div' size='sm'>
                    Withdrawal amount:
                </WalletText>
                <WalletText as='div' size='sm'>
                    {Number(cryptoAmount).toFixed(fractionalDigits.crypto as number)} {activeWallet?.currency}
                </WalletText>
            </div>
            <div className='wallets-withdrawal-crypto-form__priority-withdrawal-info--flex'>
                <WalletText as='div' size='sm'>
                    Transaction fee
                    <WalletText as='span' size='sm' weight='light'>
                        ({countDownEstimationFee}s)
                    </WalletText>
                    :
                </WalletText>
                <Tooltip alignment='top' isVisible={isHovered} message={`Fee calculated at ${serverTime} GMT`}>
                    <span className='wallets-withdrawal-crypto-form-underline' ref={hoverRef}>
                        <WalletText as='div' size='sm'>
                            {cryptoEstimationsFee.toFixed(fractionalDigits.crypto as number)} {activeWallet?.currency}
                        </WalletText>
                    </span>
                </Tooltip>
            </div>
            <hr className='wallets-withdrawal-crypto-form__priority-withdrawal-info-divider' />
            <div className='wallets-withdrawal-crypto-form__priority-withdrawal-info--flex'>
                <WalletText as='div' size='sm'>
                    Amount received:
                </WalletText>
                <WalletText as='div' size='sm' weight='bold'>
                    {Number(cryptoAmount) > 0
                        ? (
                              parseFloat(Number(cryptoAmount).toFixed(fractionalDigits.crypto as number)) -
                              Number(cryptoEstimationsFee)
                          ).toFixed(fractionalDigits.crypto as number)
                        : Number(cryptoAmount).toFixed(fractionalDigits.crypto as number)}{' '}
                    {activeWallet?.currency}
                </WalletText>
            </div>
        </div>
    );
};

export default WithdrawalCryptoPriorityFeeInfo;
