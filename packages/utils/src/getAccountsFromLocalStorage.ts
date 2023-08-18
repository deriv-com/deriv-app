import { AuthorizeResponse } from '@deriv/api-types';

type TLocalStorageAccountsList = {
    [k: string]: {
        token: string;
        accepted_bch: number;
        landing_company_shortcode: string;
        residence: string;
        session_start: number;
    } & NonNullable<NonNullable<NonNullable<AuthorizeResponse['authorize']>['account_list']>>[number];
};

/**
 * Gets the current user `accounts` list from the `localStorage`.
 */
const getAccountsFromLocalStorage = () => {
    const accounts: TLocalStorageAccountsList = JSON.parse(localStorage.getItem('client.accounts') || '{}');

    return accounts;
};

export default getAccountsFromLocalStorage;
