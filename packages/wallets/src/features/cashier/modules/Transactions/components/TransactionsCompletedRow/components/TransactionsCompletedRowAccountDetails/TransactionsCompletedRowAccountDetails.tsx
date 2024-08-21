import React from 'react';
import { Text } from '@deriv-com/ui';
import { WalletCurrencyCard, WalletMarketCurrencyIcon } from '../../../../../../../../components';
import { THooks, TPlatforms } from '../../../../../../../../types';
import { MARKET_TYPE } from '../../../../../../../cfd/constants';
import { getMarketType } from '../../../../../../helpers';
import './TransactionsCompletedRowAccountDetails.scss';

type TProps = {
    accountType: string;
    actionType: NonNullable<(THooks.InfiniteTransactions | THooks.Transactions)['action_type']>;
    currency: string;
    displayAccountName: JSX.Element | string;
    displayActionType: string;
    isDemo: boolean;
    isInterWallet?: boolean;
    mt5Group?: string;
};

const TransactionsCompletedRowAccountDetails: React.FC<TProps> = ({
    accountType,
    actionType,
    currency,
    displayAccountName,
    displayActionType,
    isDemo,
    isInterWallet = false,
    mt5Group,
}) => {
    const marketType = getMarketType(mt5Group);

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
                    marketType={marketType ?? MARKET_TYPE.ALL}
                    platform={accountType as TPlatforms.All}
                />
            )}
            <div className='wallets-transactions-completed-row-account-details__type-and-wallet-name'>
                <Text color='primary' size='xs'>
                    {displayActionType}
                </Text>
                <div className='wallets-transactions-completed-row-account-details__wallet-name'>
                    <Text color='general' size='xs' weight='bold'>
                        {displayAccountName}
                    </Text>
                </div>
            </div>
        </div>
    );
};

export default TransactionsCompletedRowAccountDetails;
