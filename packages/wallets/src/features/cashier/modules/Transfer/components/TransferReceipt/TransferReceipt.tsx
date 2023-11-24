import React from 'react';
import classNames from 'classnames';
import { AppCard, WalletButton, WalletCard, WalletText } from '../../../../../../components';
import useDevice from '../../../../../../hooks/useDevice';
import Arrow from '../../../../../../public/images/ic-back-arrow.svg';
import type { TWalletLandingCompanyName } from '../../../../../../types';
import { getTradingAppIcon, getWalletIcon } from '../../../../helpers';
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
    const appIcon = getTradingAppIcon(
        account?.account_type ?? '',
        activeWallet?.landingCompanyName as TWalletLandingCompanyName,
        account?.mt5_group
    );
    const walletIcon = getWalletIcon(activeWallet?.currency ?? '', Boolean(activeWallet?.demo_account));

    if (isTradingApp)
        return (
            <AppCard
                activeWalletCurrency={activeWallet?.currency}
                appIcon={appIcon}
                appName={account.accountName}
                balance={balance}
                cardSize='md'
                device={isMobile ? 'mobile' : 'desktop'}
                isDemoWallet={Boolean(activeWallet?.demo_account)}
                walletIcon={walletIcon}
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
                landingCompanyName={account?.landingCompanyName}
            />
        );

    return null;
};

const TransferReceipt = () => {
    const { activeWallet, receipt, resetTransfer } = useTransfer();

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
                <ReceiptCard
                    account={fromAccount}
                    activeWallet={activeWallet}
                    balance={`+ ${displayTransferredFromAmount}`}
                />
                <div className='wallets-transfer-receipt__arrow-icon'>
                    <Arrow />
                </div>
                <ReceiptCard
                    account={toAccount}
                    activeWallet={activeWallet}
                    balance={`- ${displayTransferredToAmount}`}
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
