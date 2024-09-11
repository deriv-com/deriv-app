import React from 'react';
import classNames from 'classnames';
import { LegacyArrowRight2pxIcon } from '@deriv/quill-icons';
import { Localize } from '@deriv-com/translations';
import { Button, Text, useDevice } from '@deriv-com/ui';
import { AppCard, WalletCard } from '../../../../../../components';
import { TPlatforms } from '../../../../../../types';
import { useTransfer } from '../../provider';
import './TransferReceipt.scss';

type TReceiptCardProps = {
    account: NonNullable<ReturnType<typeof useTransfer>['receipt']>['fromAccount'];
    activeWallet: ReturnType<typeof useTransfer>['activeWallet'];
    balance: string;
};

const ReceiptCard: React.FC<TReceiptCardProps> = ({ account, activeWallet, balance }) => {
    const { isDesktop } = useDevice();
    const isTradingApp = account?.account_category === 'trading';
    const isWallet = account?.account_category === 'wallet';

    if (isTradingApp)
        return (
            <AppCard
                activeWalletCurrency={activeWallet?.currency}
                appName={account?.accountName}
                balance={balance}
                cardSize='md'
                device={isDesktop ? 'desktop' : 'mobile'}
                isDemoWallet={Boolean(activeWallet?.demo_account)}
                marketType={account?.market_type}
                platform={account?.account_type as TPlatforms.All}
                product={account?.product}
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
    const { isDesktop } = useDevice();

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
    const feeMessage = feeAmount ? (
        <Localize
            i18n_default_text='Transfer fees: {{feeAmount}} {{displayCode}}'
            values={{
                displayCode: fromAccount?.currencyConfig?.display_code,
                feeAmount,
            }}
        />
    ) : (
        ''
    );

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
                    <Text size='xl' weight='bold'>
                        {transferredAmountMessage}
                    </Text>
                    {Boolean(feeMessage) && (
                        <Text color='less-prominent' size='md'>
                            {feeMessage}
                        </Text>
                    )}
                </div>
                <Text align='center' size='lg' weight='bold'>
                    <Localize i18n_default_text='Your transfer is successful!' />
                </Text>
            </div>
            <div className='wallets-transfer-receipt__button'>
                <Button
                    borderWidth='sm'
                    onClick={() => resetTransfer()}
                    size={isDesktop ? 'lg' : 'md'}
                    textSize={isDesktop ? 'sm' : 'md'}
                >
                    <Localize i18n_default_text='Make a new transfer' />
                </Button>
            </div>
        </div>
    );
};

export default TransferReceipt;
