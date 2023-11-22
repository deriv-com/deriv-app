import React from 'react';
import { THooks, TWalletLandingCompanyName } from '../../../../../../../../types';
import { getAccountName } from '../../../../../../helpers';
import { TransactionsCompletedRowAccountDetails } from '../TransactionsCompletedRowAccountDetails';

type TProps = {
    accounts: THooks.AllAccountsList;
    direction: 'from' | 'to';
    loginid: string;
};

const TransactionsCompletedRowTransferAccountDetails: React.FC<TProps> = ({ accounts, direction, loginid }) => {
    const wallet = accounts.wallets?.find(account => account.loginid === loginid);
    if (wallet)
        return (
            <TransactionsCompletedRowAccountDetails
                accountType={wallet.account_type ?? ''}
                actionType='transfer'
                currency={wallet.currency ?? 'USD'}
                displayAccountName={getAccountName({
                    accountCategory: 'wallet',
                    //@ts-expect-error this needs backend typing
                    accountType: wallet.account_type,
                    displayCurrencyCode: wallet.currency_config?.display_code ?? 'USD',
                    landingCompanyName: (wallet.landing_company_name ?? '') as TWalletLandingCompanyName,
                })}
                displayActionType={`Transfer ${direction}`}
                isDemo={Boolean(wallet.is_virtual)}
                isInterWallet
            />
        );

    const dtradeAccount = accounts.dtrade?.find(account => account.loginid === loginid);
    if (dtradeAccount) {
        return (
            <TransactionsCompletedRowAccountDetails
                accountType='standard'
                actionType='transfer'
                currency={dtradeAccount.currency ?? 'USD'}
                displayAccountName={getAccountName({
                    accountCategory: 'trading',
                    accountType: 'standard',
                    displayCurrencyCode: dtradeAccount.currency_config?.display_code ?? 'USD',
                    landingCompanyName: (dtradeAccount.landing_company_name ?? '') as TWalletLandingCompanyName,
                })}
                displayActionType={`Transfer ${direction}`}
                isDemo={Boolean(dtradeAccount.is_virtual)}
            />
        );
    }

    const dxtradeAccount = accounts.dxtrade?.find(account => account.login === loginid);
    if (dxtradeAccount)
        return (
            <TransactionsCompletedRowAccountDetails
                accountType='dxtrade'
                actionType='transfer'
                currency={dxtradeAccount.currency ?? 'USD'}
                displayAccountName={getAccountName({
                    accountCategory: 'trading',
                    accountType: 'dxtrade',
                    displayCurrencyCode: dxtradeAccount.currency ?? 'USD',
                    landingCompanyName: (dxtradeAccount.landing_company_short ?? '') as TWalletLandingCompanyName,
                })}
                displayActionType={`Transfer ${direction}`}
                isDemo={dxtradeAccount.is_virtual}
            />
        );

    const mt5Account = accounts.mt5?.find(account => account.loginid === loginid);
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
                    mt5MarketType: mt5Account.market_type,
                })}
                displayActionType={`Transfer ${direction}`}
                isDemo={mt5Account.is_virtual}
                mt5Group={mt5Account.group}
            />
        );

    return null;
};

export default TransactionsCompletedRowTransferAccountDetails;
