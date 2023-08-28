import type { AuthorizeResponse } from '@deriv/api-types';

type TLocalStorageAccount = {
    token: string;
    accepted_bch: number;
    landing_company_shortcode: string;
    residence: string;
    session_start: number;
};

type TLocalStorageAccountsList = {
    [k: string]: TLocalStorageAccount &
        NonNullable<NonNullable<NonNullable<AuthorizeResponse['authorize']>['account_list']>>[number];
};

/**
 * Gets the current user `accounts` list from the `localStorage`.
 */
const getAccountsFromLocalStorage = () => {
    const data = localStorage.getItem('client.accounts');

    // If there is no accounts list, return undefined.
    if (!data) return;

    // Cast parsed JSON data to infer return type
    return JSON.parse(data) as TLocalStorageAccountsList;
};

export default getAccountsFromLocalStorage;
