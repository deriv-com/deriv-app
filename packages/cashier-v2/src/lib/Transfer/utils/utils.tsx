import { getLandingCompanyTitleOfMT5Account, getMarketType } from '../../../helpers';
import { TTransferableAccounts } from '../types';

export const getTransferAccountName = (account: TTransferableAccounts[number]) => {
    if (account.account_type === 'binary') return account.currency;

    if (account.account_type === 'dxtrade') return 'Deriv X';

    if (account.account_type === 'ctrader') return 'Deriv cTrader';

    if (account.account_type === 'mt5') {
        const marketType = getMarketType(account.mt5_group)
            .split('')
            .map((char, i) => (i === 0 ? char.toUpperCase() : char))
            .join('');
        return `${marketType} ${getLandingCompanyTitleOfMT5Account(account.mt5_group)}`;
    }
};
