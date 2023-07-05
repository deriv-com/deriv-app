import { TransferBetweenAccountsResponse } from '@deriv/api-types';

const getAccountName = (
    account_type: NonNullable<NonNullable<TransferBetweenAccountsResponse>['accounts']>[number]['account_type'] | '',
    is_demo: boolean,
    display_code: string
) => {
    switch (account_type) {
        case 'trading':
            return is_demo ? 'Deriv Apps Demo' : 'Deriv Apps';
        case 'wallet':
            return `${is_demo ? 'Demo ' : ''}${display_code} Wallet`;
        default:
            return '';
    }
};

export default getAccountName;
