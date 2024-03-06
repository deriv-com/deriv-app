import { useCallback } from 'react';
import { useLocalStorage, useReadLocalStorage } from 'usehooks-ts';
import { getAccountsFromLocalStorage } from '@/utils';
import { useActiveTradingAccount, useCreateNewRealAccount, useSettings } from '@deriv/api-v2';

type TNewTradingAccount = NonNullable<ReturnType<typeof useCreateNewRealAccount>['data']>;

/**
 * @name useSyncLocalStorageClientAccounts
 * @description A custom hook that syncs the client accounts to the local storage
 * @returns { addTradingAccountToLocalStorage: (newAccount: TNewTradingAccount) => void }
 */
const useSyncLocalStorageClientAccounts = () => {
    const { data: activeTradingAccount } = useActiveTradingAccount();
    const { data: settingsData } = useSettings();
    const [, setLocalStorageClientAccounts] = useLocalStorage(
        'client.accounts',
        useReadLocalStorage('client.accounts') ?? {}
    );

    const addTradingAccountToLocalStorage = useCallback(
        (newAccount: TNewTradingAccount) => {
            if (newAccount && activeTradingAccount) {
                const dataToStore = {
                    accepted_bch: 0,
                    account_category: activeTradingAccount.account_category,
                    account_type: activeTradingAccount.account_type,
                    balance: 0,
                    created_at: activeTradingAccount.created_at,
                    currency: newAccount.currency,
                    email: settingsData.email,
                    excluded_until: activeTradingAccount.excluded_until,
                    is_disabled: Number(activeTradingAccount.is_disabled),
                    is_virtual: Number(activeTradingAccount.is_virtual),
                    landing_company_name: newAccount.landing_company_shortcode,
                    landing_company_shortcode: newAccount.landing_company_shortcode,
                    residence: settingsData.citizen ?? settingsData.country_code,
                    session_start: new Date().valueOf() / 1000,
                    token: newAccount.oauth_token,
                };

                const clientAccounts = getAccountsFromLocalStorage() ?? {};
                const localStorageData = {
                    ...clientAccounts,
                    [newAccount.client_id]: dataToStore,
                    [activeTradingAccount.loginid]: {
                        ...clientAccounts[activeTradingAccount.loginid],
                        linked_to: [{ loginid: newAccount.client_id, platform: 'dtrade' }],
                    },
                };
                setLocalStorageClientAccounts(localStorageData);
            }
        },
        [activeTradingAccount, setLocalStorageClientAccounts, settingsData]
    );

    return { addTradingAccountToLocalStorage };
};

export default useSyncLocalStorageClientAccounts;
