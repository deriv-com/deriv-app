import React from 'react';
import classNames from 'classnames';
import { WalletButton, WalletCard, WalletText } from '../../../../../../components';
import Arrow from '../../../../../../public/images/ic-back-arrow.svg';
import { useTransfer } from '../../provider';
import './TransferReceipt.scss';

const TransferReceipt = () => {
    const { receipt, resetTransfer } = useTransfer();

    if (!receipt) return null;

    const { feeAmount, feePercentage, fromAccount, fromAmount, toAccount, toAmount } = receipt;

    const isSameCurrency = fromAccount?.currency === toAccount?.currency;
    const displayTransferredFromAmount = `${fromAmount.toFixed(fromAccount?.currencyConfig?.fractional_digits)} ${
        fromAccount?.currencyConfig?.display_code
    }`;
    const displayTransferredToAmount = `${toAmount.toFixed(toAccount?.currencyConfig?.fractional_digits)} ${
        toAccount?.currencyConfig?.display_code
    }`;
    const transferredAmountMessage = isSameCurrency
        ? displayTransferredFromAmount
        : `${displayTransferredFromAmount} (${displayTransferredToAmount})`;
    const feeMessage = feeAmount
        ? `${feePercentage}% transfer fees: ${feeAmount} ${fromAccount?.currencyConfig?.display_code}`
        : '';

    return (
        <div className='wallets-transfer-receipt'>
            <div className='wallets-transfer-receipt__cards'>
                <WalletCard
                    balance={`+ ${displayTransferredFromAmount}`}
                    currency={fromAccount?.currency || ''}
                    iconSize='md'
                    isDemo={Boolean(fromAccount?.demo_account)}
                    landingCompanyName={fromAccount?.landingCompanyName}
                />
                <div className='wallets-transfer-receipt__arrow-icon'>
                    <Arrow />
                </div>
                <WalletCard
                    balance={`- ${displayTransferredToAmount}`}
                    currency={toAccount?.currency || ''}
                    iconSize='md'
                    isDemo={Boolean(toAccount?.demo_account)}
                    landingCompanyName={toAccount?.landingCompanyName}
                />
            </div>
            <div
                className={classNames('wallets-transfer-receipt__info', {
                    'wallets-transfer-receipt__info--with-fee': Boolean(receipt?.feeAmount),
                })}
            >
                <div className='wallets-transfer-receipt__amount'>
                    <WalletText size='xl' weight='bold'>
                        {transferredAmountMessage}
                    </WalletText>
                    {Boolean(feeMessage) && (
                        <WalletText color='less-prominent' size='md'>
                            {feeMessage}
                        </WalletText>
                    )}
                </div>
                <WalletText align='center' size='lg' weight='bold'>
                    Your transfer is successful!
                </WalletText>
            </div>
            <div className='wallets-transfer-receipt__button'>
                <WalletButton
                    onClick={() => resetTransfer()}
                    size='lg'
                    text='Make a new transfer'
                    variant='contained'
                />
            </div>
        </div>
    );
};

export default TransferReceipt;
