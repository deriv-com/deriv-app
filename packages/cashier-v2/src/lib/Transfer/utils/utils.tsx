import { getMT5AccountDetails } from '../../../helpers';
import { TTransferableAccounts } from '../types';

export const getTransferAccountName = (account: TTransferableAccounts[number]) => {
    if (account.account_type === 'binary') return account.currency;

    if (account.account_type === 'dxtrade') return 'Deriv X';

    if (account.account_type === 'ctrader') return 'Deriv cTrader';

    if (account.account_type === 'mt5') {
        const accountDetails = getMT5AccountDetails(account.mt5_group);
        const marketType = accountDetails.marketTypeDetails.title;
        const landingCompanyDetails = accountDetails.landingCompanyDetails.title;
        return `${marketType} ${landingCompanyDetails}`;
    }
};
