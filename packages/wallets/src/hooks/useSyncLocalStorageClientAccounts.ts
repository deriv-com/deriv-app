import { useCallback } from 'react';
import moment from 'moment';
import { useLocalStorage, useReadLocalStorage } from 'usehooks-ts';
import { useCreateNewRealAccount, useCreateWallet, useSettings, useMutation } from '@deriv/api-v2';
import { getAccountsFromLocalStorage } from '@deriv/utils';

type TNewWalletAccount = NonNullable<ReturnType<typeof useCreateWallet>['data']>;
type TNewTradingAccount = NonNullable<ReturnType<typeof useCreateNewRealAccount>['data']>;

const useSyncLocalStorageClientAccounts = () => {
    const { mutateAsync } = useMutation('authorize');
    const { data: settingsData } = useSettings();
    const [, setLocalStorageClientAccounts] = useLocalStorage(
        'client.accounts',
        useReadLocalStorage('client.accounts') ?? {}
    );

    const addWalletAccountToLocalStorage = useCallback(
        async (newAccount: TNewWalletAccount) => {
            if (!newAccount) return;

            const data = await mutateAsync({ payload: { authorize: newAccount.oauth_token } });

            if (!data) return;

            const authorize = data.authorize;
            // eslint-disable-next-line
            const acccount_list = authorize?.account_list;

            if (!acccount_list) return;

            const account = acccount_list.find(acc => acc.loginid === newAccount.client_id);

            if (!account) return;

            if (newAccount && account) {
                const dataToStore = {
                    accepted_bch: 0,
                    account_category: account.account_category,
                    account_type: account.account_type,
                    balance: 0,
                    created_at: account.created_at,
                    currency: newAccount.currency,
                    email: settingsData.email,
                    excluded_until: account.excluded_until,
                    is_disabled: Number(account.is_disabled),
                    is_virtual: Number(account.is_virtual),
                    landing_company_name: account.landing_company_name?.replace('maltainvest', 'malta'),
                    landing_company_shortcode: newAccount.landing_company_shortcode,
                    linked_to: account.linked_to,
                    residence: settingsData.citizen || settingsData.country_code,
                    session_start: moment().utc().valueOf() / 1000,
                    token: newAccount.oauth_token,
                };

                const clientAccounts = getAccountsFromLocalStorage() ?? {};
                const localStorageData = { ...clientAccounts, [newAccount.client_id]: dataToStore };
                setLocalStorageClientAccounts(localStorageData);
            }
        },
        [setLocalStorageClientAccounts, settingsData]
    );

    const addTradingAccountToLocalStorage = useCallback(
        async (newAccount: TNewTradingAccount) => {
            if (!newAccount) return;

            const data = await mutateAsync({ payload: { authorize: newAccount.oauth_token } });

            if (!data) return;

            const authorize = data.authorize;
            const acccount_list = authorize?.account_list;

            if (!acccount_list) return;

            const account = acccount_list.find(acc => acc.loginid === newAccount.client_id);

            if (!account || !account.loginid) return;

            if (newAccount) {
                const dataToStore = {
                    accepted_bch: 0,
                    account_category: 'trading',
                    account_type: 'standard',
                    balance: 0,
                    created_at: account.created_at,
                    currency: newAccount.currency,
                    email: settingsData.email,
                    excluded_until: account.excluded_until,
                    is_disabled: Number(account.is_disabled),
                    is_virtual: Number(account.is_virtual),
                    landing_company_name: newAccount.landing_company_shortcode,
                    landing_company_shortcode: newAccount.landing_company_shortcode,
                    linked_to: [],
                    residence: settingsData.citizen || settingsData.country_code,
                    session_start: moment().utc().valueOf() / 1000,
                    token: newAccount.oauth_token,
                };

                const clientAccounts = getAccountsFromLocalStorage() ?? {};
                const localStorageData = {
                    ...clientAccounts,
                    [newAccount.client_id]: dataToStore,
                    [account.loginid]: {
                        ...clientAccounts[account.loginid],
                        linked_to: [{ loginid: newAccount.client_id, platform: 'dtrade' }],
                    },
                };
                setLocalStorageClientAccounts(localStorageData);
            }
        },
        [setLocalStorageClientAccounts, settingsData]
    );

    return { addTradingAccountToLocalStorage, addWalletAccountToLocalStorage };
};

export default useSyncLocalStorageClientAccounts;
