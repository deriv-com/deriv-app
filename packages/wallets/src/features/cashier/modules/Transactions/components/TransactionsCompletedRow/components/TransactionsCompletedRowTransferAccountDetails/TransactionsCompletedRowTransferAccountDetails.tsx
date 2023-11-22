import React from 'react';
import { THooks, TWalletLandingCompanyName } from '../../../../../../../../types';
import { getAccountName, getMarketType } from '../../../../../../helpers';
import { TransactionsCompletedRowAccountDetails } from '../TransactionsCompletedRowAccountDetails';

type TProps = {
    direction: 'from' | 'to';
    loginid: string;
    wallet: THooks.ActiveWalletAccountVerbose;
};

const TransactionsCompletedRowTransferAccountDetails: React.FC<TProps> = ({ direction, loginid, wallet }) => {
    const otherWallet = wallet.linked_to.wallets?.find(account => account.loginid === loginid);
    if (otherWallet)
        return (
            <TransactionsCompletedRowAccountDetails
                accountType={otherWallet.account_type ?? ''}
                actionType='transfer'
                currency={otherWallet.currency ?? 'USD'}
                displayAccountName={getAccountName({
                    accountCategory: 'wallet',
                    accountType: otherWallet.account_type,
                    displayCurrencyCode: otherWallet.currency_config?.display_code ?? 'USD',
                    landingCompanyName: (otherWallet.landing_company_name ?? '') as TWalletLandingCompanyName,
                })}
                displayActionType={`Transfer ${direction}`}
                isDemo={Boolean(otherWallet.is_virtual)}
                isInterWallet={true}
            />
        );

    const dtradeAccount = wallet.linked_to?.dtrade?.find(account => account.loginid === loginid);
    if (dtradeAccount)
        return (
            <TransactionsCompletedRowAccountDetails
                accountType='standard'
                actionType='transfer'
                currency={wallet.currency ?? 'USD'}
                displayAccountName={getAccountName({
                    accountCategory: 'trading',
                    accountType: 'standard',
                    displayCurrencyCode: wallet.currency_config?.display_code ?? 'USD',
                    landingCompanyName: (wallet.landing_company_name ?? '') as TWalletLandingCompanyName,
                })}
                displayActionType={`Transfer ${direction}`}
                isDemo={Boolean(wallet.is_virtual)}
                isInterWallet={false}
            />
        );

    const mt5Account = wallet.linked_to.mt5?.find(account => account.loginid === loginid);
    if (mt5Account)
        return (
            <TransactionsCompletedRowAccountDetails
                accountType='mt5'
                actionType='transfer'
                currency={mt5Account.currency ?? 'USD'}
                displayAccountName={getAccountName({
                    accountCategory: 'trading',
                    accountType: 'mt5',
                    displayCurrencyCode: mt5Account.currency ?? 'USD',
                    landingCompanyName: (mt5Account.landing_company_short ?? '') as TWalletLandingCompanyName,
                    mt5MarketType: getMarketType(mt5Account.group),
                })}
                displayActionType={`Transfer ${direction}`}
                isDemo={Boolean(wallet.is_virtual)}
                isInterWallet={false}
                mt5Group={mt5Account.group}
            />
        );

    return null;
};

export default TransactionsCompletedRowTransferAccountDetails;
