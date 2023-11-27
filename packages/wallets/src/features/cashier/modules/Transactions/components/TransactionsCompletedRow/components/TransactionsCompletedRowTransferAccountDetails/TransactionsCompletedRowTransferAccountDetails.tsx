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
    const dtradeAccount = accounts.dtrade?.find(account => account.loginid === loginid);
    const dxtradeAccount = accounts.dxtrade?.find(account => account.account_id === loginid);
    // TODO: remove the `replace` calls once backend resolves `statement` and `mt5_login_list` accounts `loginid` inconsistency
    const mt5Account = accounts.mt5?.find(
        account => account.login?.replace(/^\D+/g, '') === loginid.replace(/^\D+/g, '')
    );
    const ctraderAccount = accounts.ctrader?.find(account => account.login === loginid);

    const transferAccount = [wallet, dtradeAccount, dxtradeAccount, mt5Account, ctraderAccount].find(Boolean);

    if (transferAccount) {
        const derivAccountType = transferAccount === wallet ? 'wallet' : 'standard';
        const accountType = transferAccount?.platform !== 'deriv' ? transferAccount.platform : derivAccountType;
        const displayAccountName = getAccountName({
            accountCategory: transferAccount === wallet ? 'wallet' : 'trading',
            //@ts-expect-error this needs backend typing
            accountType,
            displayCurrencyCode: transferAccount.currency_config?.display_code ?? 'USD',
            landingCompanyName: transferAccount.landing_company_name as TWalletLandingCompanyName,
            mt5MarketType: transferAccount === mt5Account ? mt5Account.market_type : undefined,
        });

        return (
            <TransactionsCompletedRowAccountDetails
                accountType={accountType ?? ''}
                actionType='transfer'
                currency={transferAccount.currency ?? 'USD'}
                displayAccountName={displayAccountName}
                displayActionType={`Transfer ${direction}`}
                isDemo={Boolean(transferAccount.is_virtual)}
                isInterWallet={transferAccount === wallet}
                mt5Group={transferAccount === mt5Account ? mt5Account.group : undefined}
            />
        );
    }

    return null;
};

export default TransactionsCompletedRowTransferAccountDetails;
