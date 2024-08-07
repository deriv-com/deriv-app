import React from 'react';
import classNames from 'classnames';
import { LegacyArrowRight2pxIcon } from '@deriv/quill-icons';
import { Button } from '@deriv-com/ui';
import { AppCard, WalletCard, WalletText } from '../../../../../../components';
import useDevice from '../../../../../../hooks/useDevice';
import { TPlatforms } from '../../../../../../types';
import { useTransfer } from '../../provider';
import './TransferReceipt.scss';

type TReceiptCardProps = {
    account: NonNullable<ReturnType<typeof useTransfer>['receipt']>['fromAccount'];
    activeWallet: ReturnType<typeof useTransfer>['activeWallet'];
    balance: string;
};

const ReceiptCard: React.FC<TReceiptCardProps> = ({ account, activeWallet, balance }) => {
    const { isMobile } = useDevice();
    const isTradingApp = account?.account_category === 'trading';
    const isWallet = account?.account_category === 'wallet';

    if (isTradingApp)
        return (
            <AppCard
                activeWalletCurrency={activeWallet?.currency}
                appName={account?.accountName}
                balance={balance}
                cardSize='md'
                device={isMobile ? 'mobile' : 'desktop'}
                isDemoWallet={Boolean(activeWallet?.demo_account)}
                marketType={account?.market_type}
                platform={account?.account_type as TPlatforms.All}
                walletName={activeWallet?.accountName}
            />
        );

    if (isWallet)
        return (
            <WalletCard
                balance={balance}
                currency={account.currency ?? ''}
                iconSize='md'
                isDemo={Boolean(account?.demo_account)}
            />
        );

    return null;
};

const TransferReceipt = () => {
    const { activeWallet, receipt, resetTransfer } = useTransfer();
    const { isMobile } = useDevice();

    if (!receipt) return null;

    const { feeAmount, fromAccount, fromAmount, toAccount, toAmount } = receipt;

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
    const feeMessage = feeAmount ? `Transfer fees: ${feeAmount} ${fromAccount?.currencyConfig?.display_code}` : '';

    return (
        <div className='wallets-transfer-receipt'>
            <div className='wallets-transfer-receipt__cards'>
                <ReceiptCard
                    account={fromAccount}
                    activeWallet={activeWallet}
                    balance={`-${displayTransferredFromAmount}`}
                />
                <div className='wallets-transfer-receipt__arrow-icon'>
                    <LegacyArrowRight2pxIcon iconSize='xs' />
                </div>
                <ReceiptCard
                    account={toAccount}
                    activeWallet={activeWallet}
                    balance={`+${displayTransferredToAmount}`}
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
                <Button
                    borderWidth='sm'
                    onClick={() => resetTransfer()}
                    size={isMobile ? 'md' : 'lg'}
                    textSize={isMobile ? 'md' : 'sm'}
                >
                    Make a new transfer
                </Button>
            </div>
        </div>
    );
};

export default TransferReceipt;
