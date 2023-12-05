import React from 'react';
import {
    WalletCurrencyCard,
    WalletListCardBadge,
    WalletsAppLinkedWithWalletIcon,
    WalletText,
} from '../../../../../../../../components';
import { THooks, TWalletLandingCompanyName } from '../../../../../../../../types';
import { getTradingAppIcon, getWalletIcon } from '../../../../../../helpers';
import './TransactionsCompletedRowAccountDetails.scss';

type TProps = {
    accountType: string;
    actionType: NonNullable<(THooks.InfiniteTransactions | THooks.Transactions)['action_type']>;
    currency: string;
    displayAccountName: string;
    displayActionType: string;
    isDemo: boolean;
    isInterWallet?: boolean;
    landingCompanyName?: TWalletLandingCompanyName;
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
    landingCompanyName,
    mt5Group,
}) => {
    return (
        <div className='wallets-transactions-completed-row-account-details'>
            {actionType !== 'transfer' || isInterWallet ? (
                <WalletCurrencyCard currency={currency} isDemo={isDemo} size='md' />
            ) : (
                <WalletsAppLinkedWithWalletIcon
                    appIcon={getTradingAppIcon(accountType, landingCompanyName ?? 'svg', mt5Group)}
                    currency={currency}
                    isDemo={isDemo}
                    walletIcon={getWalletIcon(currency, isDemo)}
                />
            )}
            <div className='wallets-transactions-completed-row-account-details__type-and-wallet-name'>
                <WalletText color='primary' size='xs'>
                    {displayActionType}
                </WalletText>
                <div className='wallets-transactions-completed-row-account-details__wallet-name'>
                    <WalletText color='general' size='xs' weight='bold'>
                        {displayAccountName}
                    </WalletText>
                    {!isDemo && <WalletListCardBadge label={landingCompanyName} />}
                </div>
            </div>
        </div>
    );
};

export default TransactionsCompletedRowAccountDetails;
