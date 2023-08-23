import { useMemo } from 'react';
import useAvailableMT5Accounts from './useAvailableMT5Accounts';
import useExistingCFDAccounts from './useExistingCFDAccounts';
import useAuthorize from './useAuthorize';

type TPartialCfdAccount = {
    landing_company_short?: string;
    shortcode?: string;
    market_type?: string;
    server_info?: {
        geolocation?: {
            region?: string;
            sequence?: number;
        };
    };
};

/** There is in shared package but not sure can I use this package or not */
// eu countries to support
const eu_countries = [
    'it',
    'de',
    'fr',
    'lu',
    'gr',
    'mf',
    'es',
    'sk',
    'lt',
    'nl',
    'at',
    'bg',
    'si',
    'cy',
    'be',
    'ro',
    'hr',
    'pt',
    'pl',
    'lv',
    'ee',
    'cz',
    'fi',
    'hu',
    'dk',
    'se',
    'ie',
    'im',
    'gb',
    'mt',
];

// check if client is from EU
const isEuCountry = (country: string) => eu_countries.includes(country);

// define region
const default_region = (loginid: string, country: string) => {
    const active_demo = /^VRT|VRW/.test(loginid);
    const active_real_mf = /^MF|MFW/.test(loginid);

    if (((active_demo || active_real_mf) && isEuCountry(country)) || active_real_mf) {
        return 'EU';
    }
    return 'Non-EU';
};

// check for EU user
const is_eu_user = (loginid: string, country: string) => {
    const selected_region = default_region(loginid, country);

    return selected_region === 'EU';
};

// get server name
const getServerName = (account: TPartialCfdAccount) => {
    if (account) {
        const server_region = account.server_info?.geolocation?.region;
        if (server_region) {
            return `${server_region} ${
                account?.server_info?.geolocation?.sequence === 1 ? '' : account?.server_info?.geolocation?.sequence
            }`;
        }
    }
    return '';
};

// check for mitliple SVG Synthetic accounts
const hasMultipleSVGAccounts = (existed_cfd_mt5_accounts: TPartialCfdAccount[]) => {
    const all_svg_acc = existed_cfd_mt5_accounts.filter(
        acc => acc.landing_company_short === 'svg' && acc.market_type === 'synthetic'
    );
    return all_svg_acc.length > 1;
};

/**
 * Get shortcode and region
 * @param active_loginid - active loginid
 * @param is_virtual - account is virtual or not
 * @param country - residence country
 * @param cfd_account - CFD account
 * @param existed_cfd_mt5_accounts - existed CFD accounts
 * @returns {string} - Shortcode and region
 */
export const getShortCodeAndRegion = (
    active_loginid: string,
    is_virtual: boolean,
    country: string,
    cfd_account: TPartialCfdAccount,
    existed_cfd_mt5_accounts: TPartialCfdAccount[]
): string => {
    let short_code_and_region = '';
    if (!is_virtual && !is_eu_user(active_loginid, country)) {
        const code = cfd_account.landing_company_short ?? cfd_account.shortcode;

        const short_code =
            code && code !== 'svg' && code !== 'bvi'
                ? code?.charAt(0).toUpperCase() + code?.slice(1)
                : code?.toUpperCase();

        let region = '';
        if (hasMultipleSVGAccounts(existed_cfd_mt5_accounts)) {
            region =
                cfd_account.market_type !== 'financial' && code !== 'bvi' ? ` - ${getServerName(cfd_account)}` : '';
        }
        short_code_and_region = `${short_code}${region}`;
    }
    return short_code_and_region;
};

/**
 *
 * @description This hook is to compare the available MT5 accounts with the existing CFD accounts and return the filtered list.
 *
 */
const useFilteredCFDAccounts = () => {
    const { data: available_mt5_accounts, ...rest_available_mt5_accounts } = useAvailableMT5Accounts();
    const { data: existing_cfd_accounts, ...rest_existing_cfd_accounts } = useExistingCFDAccounts();
    const { data: authorize_data } = useAuthorize();

    const combined_mt5_accounts = useMemo(() => {
        if (!available_mt5_accounts) return undefined;

        return (
            Object.keys(available_mt5_accounts)
                // Map over available market types
                .map(market_type => {
                    // Change the market type from 'gaming' to 'synthetic' to match the existing CFD accounts
                    const modified_market_type = market_type.replace('gaming', 'synthetic');
                    const landing_company_order = ['svg', 'bvi', 'labuan', 'vanuatu'];

                    // Find the existing CFD account that matches the market type and sort them by the correct landing companies
                    const existing_mt5_accounts = existing_cfd_accounts?.mt5_accounts
                        ?.filter(mt5 => mt5.market_type === modified_market_type)
                        .sort((a, b) => {
                            const a_index = landing_company_order.indexOf(a.landing_company_short || '');
                            const b_index = landing_company_order.indexOf(b.landing_company_short || '');
                            return a_index - b_index;
                        });

                    // Map over the available accounts and add the existing CFD account if it exists
                    return available_mt5_accounts[market_type].map((available, index) => {
                        // Find the existing CFD account with the index
                        const existing_mt5_account = existing_mt5_accounts?.[index];

                        // Check if the account is added
                        const is_added = !!existing_mt5_account;

                        return {
                            ...available,
                            ...existing_mt5_account,
                            market_type: modified_market_type,
                            short_code_and_region: getShortCodeAndRegion(
                                authorize_data?.loginid || '',
                                Boolean(authorize_data?.is_virtual),
                                authorize_data?.country || '',
                                existing_mt5_account || available,
                                existing_cfd_accounts?.mt5_accounts
                            ),
                            is_added,
                        };
                    });
                })
        );
    }, [
        authorize_data?.country,
        authorize_data?.is_virtual,
        authorize_data?.loginid,
        available_mt5_accounts,
        existing_cfd_accounts?.mt5_accounts,
    ]);

    /** Categorizes the accounts into different market types and groups them together */
    const categorized_mt5_accounts = useMemo(() => {
        if (!combined_mt5_accounts) return {};

        const categorized_accounts = combined_mt5_accounts.flat().reduce((acc, account) => {
            const { market_type } = account;
            if (!acc[market_type]) acc[market_type] = [];
            acc[market_type].push(account);
            return acc;
        }, {} as Record<string, typeof combined_mt5_accounts[number]>);

        return Object.fromEntries(
            Object.entries(categorized_accounts).map(([market_type, accounts]) => {
                const added_accounts = accounts.filter(account => account.is_added);
                const not_added_accounts = accounts.filter(account => !account.is_added);
                return [market_type, added_accounts.length ? added_accounts : [not_added_accounts[0]]];
            })
        );
    }, [combined_mt5_accounts]);

    return {
        data: categorized_mt5_accounts,
        ...rest_existing_cfd_accounts,
        isLoading: rest_available_mt5_accounts.isLoading || rest_existing_cfd_accounts.isLoading,
    };
};

export default useFilteredCFDAccounts;
