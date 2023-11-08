import { useCallback } from 'react';
import moment from 'moment';
import { useActiveAccount, useCreateWallet, useSettings } from '@deriv/api';

type TNewAccount = NonNullable<ReturnType<typeof useCreateWallet>['data']>;

const useSyncLocalStorageClientAccounts = () => {
    const { data } = useActiveAccount();
    const { data: settingsData } = useSettings();

    const syncLocalStorageClientAccounts = useCallback(
        (newAccount: TNewAccount) => {
            if (newAccount && data) {
                const dataToStore = {
                    accepted_bch: 0,
                    account_category: data.account_category,
                    account_type: data.account_type,
                    balance: 0,
                    created_at: data.created_at,
                    currency: newAccount.currency,
                    email: settingsData.email,
                    excluded_until: data.excluded_until,
                    is_disabled: data.is_disabled,
                    is_virtual: data.is_virtual,
                    landing_company_name: newAccount.landing_company,
                    landing_company_shortcode: newAccount.landing_company_shortcode,
                    linked_to: data.linked_to,
                    residence: settingsData.citizen || settingsData.country_code,
                    session_start: moment().utc().valueOf() / 1000,
                    token: newAccount.oauth_token,
                };

                const clientAccounts = JSON.parse(localStorage.getItem('client.accounts') ?? '{}');
                localStorage.setItem(
                    'client.accounts',
                    JSON.stringify({ ...clientAccounts, [newAccount.client_id]: dataToStore })
                );
            }
        },
        [data, settingsData]
    );

    return syncLocalStorageClientAccounts;
};

export default useSyncLocalStorageClientAccounts;
