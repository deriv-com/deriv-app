type TPartialCfdAccount = {
    landing_company_short?: string;
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
const getShortCodeAndRegion = (
    active_loginid: string,
    is_virtual: boolean,
    country: string,
    cfd_account: TPartialCfdAccount,
    existed_cfd_mt5_accounts: TPartialCfdAccount[]
): string => {
    let short_code_and_region = '';
    if (!is_virtual && !is_eu_user(active_loginid, country)) {
        const short_code =
            cfd_account.landing_company_short &&
            cfd_account.landing_company_short !== 'svg' &&
            cfd_account.landing_company_short !== 'bvi'
                ? cfd_account.landing_company_short?.charAt(0).toUpperCase() +
                  cfd_account.landing_company_short?.slice(1)
                : cfd_account.landing_company_short?.toUpperCase();

        let region = '';
        if (hasMultipleSVGAccounts(existed_cfd_mt5_accounts)) {
            region =
                cfd_account.market_type !== 'financial' && cfd_account.landing_company_short !== 'bvi'
                    ? ` - ${getServerName(cfd_account)}`
                    : '';
        }
        short_code_and_region = `${short_code}${region}`;
    }
    return short_code_and_region;
};

export default getShortCodeAndRegion;
