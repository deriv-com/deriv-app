import React from 'react';
import { THooks, TWalletLandingCompanyName } from '../../../../../../../../types';
import { getAccountName } from '../../../../../../helpers';
import useTransferAccountDetailsByLoginId from '../../hooks/useTransferAccountDetailsByLoginId';
import { TransactionsCompletedRowAccountDetails } from '../TransactionsCompletedRowAccountDetails';

const isMT5Account = (account: unknown): account is THooks.MT5AccountsList => {
    return typeof account === 'object' && !!account && 'account_type' in account && account?.account_type === 'mt5';
};

type TProps = {
    direction: 'from' | 'to';
    loginid: string;
    wallet: THooks.ActiveWalletAccount;
};

const TransactionsCompletedRowTransferAccountDetails: React.FC<TProps> = ({ direction, loginid, wallet }) => {
    const { account } = useTransferAccountDetailsByLoginId(loginid);

    if (account)
        return (
            <TransactionsCompletedRowAccountDetails
                accountType={account.account_type ?? ''}
                actionType='transfer'
                currency={account.currency ?? 'USD'}
                displayAccountName={getAccountName({
                    accountCategory: account.account_category,
                    //@ts-expect-error wait until this is typed on the backend
                    accountType: account.account_type,
                    displayCurrencyCode: account.currency_config?.display_code ?? 'USD',
                    landingCompanyName: (account.landing_company_name ?? '') as TWalletLandingCompanyName,
                })}
                displayActionType={`Transfer ${direction}`}
                isDemo={account.is_virtual}
                isInterWallet={account.is_wallet}
                mt5Group={isMT5Account(account) ? account.group : undefined}
            />
        );

    const dtradeAccount = wallet.linked_to?.find(
        account => account.loginid === loginid && account.platform === 'dtrade'
    );

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
                isDemo={wallet.is_virtual}
                isInterWallet={false}
            />
        );

    return null;
};

export default TransactionsCompletedRowTransferAccountDetails;
