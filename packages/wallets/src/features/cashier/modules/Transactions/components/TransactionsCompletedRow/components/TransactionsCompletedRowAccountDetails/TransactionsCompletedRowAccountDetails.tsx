import React from 'react';
import { Localize } from '@deriv-com/translations';
import { Text, useDevice } from '@deriv-com/ui';
import { WalletCurrencyCard, WalletMarketCurrencyIcon } from '../../../../../../../../components';
import { THooks, TPlatforms } from '../../../../../../../../types';
import './TransactionsCompletedRowAccountDetails.scss';

type TProps = {
    accountType: string;
    actionType: NonNullable<(THooks.InfiniteTransactions | THooks.Transactions)['action_type']>;
    currency: string;
    displayAccountName: JSX.Element | string;
    displayActionType: string;
    isDemo: boolean;
    isInterWallet?: boolean;
    marketType?: string;
    product?: THooks.AvailableMT5Accounts['product'];
    transactionID?: number;
};

const TransactionsCompletedRowAccountDetails: React.FC<TProps> = ({
    accountType,
    actionType,
    currency,
    displayAccountName,
    displayActionType,
    isDemo,
    isInterWallet = false,
    marketType,
    product,
    transactionID,
}) => {
    const { isDesktop } = useDevice();

    return (
        <div className='wallets-transactions-completed-row-account-details'>
            {actionType !== 'transfer' || isInterWallet ? (
                <WalletCurrencyCard
                    className='wallets-transactions-completed-row-account-details__currency-card'
                    currency={currency}
                    isDemo={isDemo}
                    size='md'
                />
            ) : (
                <WalletMarketCurrencyIcon
                    currency={currency}
                    isDemo={isDemo}
                    marketType={marketType}
                    platform={accountType as TPlatforms.All}
                    product={product}
                />
            )}
            <div
                className='wallets-transactions-completed-row-account-details__type-and-wallet-name 
            wallets-transactions-completed-row-account-details__column'
            >
                <Text color='primary' size='xs'>
                    {displayActionType}
                </Text>
                <div className='wallets-transactions-completed-row-account-details__wallet-name'>
                    <Text color='general' size='xs' weight='bold'>
                        {displayAccountName}
                    </Text>
                </div>
                {!isDesktop && (
                    <Text
                        as='div'
                        className='wallets-transactions-completed-row-account-details__transaction-id'
                        color='less-prominent'
                        size='xs'
                    >
                        <Localize i18n_default_text='Ref. ID: {{transactionID}}' values={{ transactionID }} />
                    </Text>
                )}
            </div>
            {isDesktop && (
                <div className='wallets-transactions-completed-row-account-details__column'>
                    <Text as='div' color='less-prominent' size='2xs'>
                        <Localize i18n_default_text='Ref. ID' />
                    </Text>
                    <Text as='div' color='general' size='2xs'>
                        {transactionID}
                    </Text>
                </div>
            )}
        </div>
    );
};

export default TransactionsCompletedRowAccountDetails;
