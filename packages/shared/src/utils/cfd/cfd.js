import { CFD_PLATFORMS } from '../platform';

let CFD_text_translated;

// TODO: add swap_free to this file when ready
const CFD_text = {
    dxtrade: 'Deriv X',
    mt5: 'MT5',
    mt5_cfds: 'MT5 CFDs',
    cfd: 'CFDs',
    synthetic: 'Synthetic',
    synthetic_bvi: 'Synthetic BVI',
    synthetic_svg: 'Synthetic SVG',
    financial: 'Financial',
    financial_bvi: 'Financial BVI',
    financial_fx: 'Financial Labuan',
    financial_v: 'Financial Vanuatu',
    financial_svg: 'Financial SVG',
};

// * mt5_login_list returns these:
// market_type: "financial" | "gaming"
// sub_account_type: "financial" | "financial_stp" | "swap_free"
// *
// sub_account_type financial_stp only happens in "financial" market_type
export const getCFDAccountKey = ({ market_type, sub_account_type, platform, shortcode }) => {
    if (market_type === 'all') {
        return 'dxtrade';
    }

    if (market_type === 'gaming' || market_type === 'synthetic') {
        if (platform === CFD_PLATFORMS.DXTRADE || sub_account_type === 'financial') {
            switch (shortcode) {
                case 'svg':
                    return 'synthetic_svg';
                case 'bvi':
                    return 'synthetic_bvi';
                default:
                    return 'synthetic';
            }
        }
    }
    if (market_type === 'financial') {
        if (
            platform === CFD_PLATFORMS.DXTRADE ||
            sub_account_type === 'financial' ||
            sub_account_type === 'financial_stp'
        ) {
            switch (shortcode) {
                case 'svg':
                    return 'financial_svg';
                case 'bvi':
                    return 'financial_bvi';
                case 'labuan':
                    return 'financial_fx';
                case 'vanuatu':
                    return 'financial_v';
                default:
                    return 'financial';
            }
        }
    }
    return undefined;
};

/**
 * Generate the enum for API request.
 *
 * @param {string} category [real, demo]
 * @param {string} type [synthetic, financial, financial_stp]
 * @return {string}
 */
export const getAccountTypeFields = ({ category, type }) => {
    const map_mode = {
        real: {
            synthetic: {
                account_type: 'gaming',
            },
            financial: {
                account_type: 'financial',
                mt5_account_type: 'financial',
            },
        },
        demo: {
            synthetic: {
                account_type: 'demo',
            },
            financial: {
                account_type: 'demo',
                mt5_account_type: 'financial',
            },
        },
    };

    return map_mode[category][type];
};

export const getCFDAccountDisplay = ({
    market_type,
    sub_account_type,
    platform,
    is_eu,
    shortcode,
    is_mt5_trade_modal,
}) => {
    let cfd_account_key = getCFDAccountKey({ market_type, sub_account_type, platform, shortcode });
    if (!cfd_account_key) return undefined;

    if (cfd_account_key === 'financial' && is_eu) {
        if (is_mt5_trade_modal) cfd_account_key = 'mt5_cfds';
        else cfd_account_key = 'cfd';
    }

    return CFD_text_translated[cfd_account_key]();
};

export const getCFDAccount = ({ market_type, sub_account_type, platform, is_eu }) => {
    let cfd_account_key = getCFDAccountKey({ market_type, sub_account_type, platform });
    if (!cfd_account_key) return undefined;

    if (cfd_account_key === 'financial' && is_eu) {
        cfd_account_key = 'cfd';
    }

    return CFD_text[cfd_account_key];
};

export const setSharedCFDText = all_shared_CFD_text => {
    CFD_text_translated = all_shared_CFD_text;
};

export const getAccountListKey = (account, platform, shortcode) => {
    return `${account.platform || platform}.${account.account_type}.${getCFDAccountKey({
        market_type: account.market_type,
        sub_account_type: account.sub_account_type,
        platform,
        shortcode,
    })}@${platform === CFD_PLATFORMS.DXTRADE ? account.market_type : account.server}`;
};

export const getCFDPlatformLabel = platform => {
    switch (platform) {
        case CFD_PLATFORMS.MT5:
            return 'DMT5';
        case CFD_PLATFORMS.DXTRADE:
            return 'Deriv X';
        default:
            return '';
    }
};

export const isLandingCompanyEnabled = ({ landing_companies, platform, type }) => {
    if (platform === CFD_PLATFORMS.MT5) {
        if (type === 'gaming') return !!landing_companies?.mt_gaming_company?.financial;
        if (type === 'financial') return !!landing_companies?.mt_financial_company?.financial;
        if (type === 'financial_stp') return !!landing_companies?.mt_financial_company?.financial_stp;
    } else if (platform === CFD_PLATFORMS.DXTRADE) {
        if (type === 'gaming') return !!landing_companies?.dxtrade_gaming_company?.standard;
        if (type === 'financial') return !!landing_companies?.dxtrade_financial_company?.standard;
    }
    return false;
};

export const getIdentityStatusInfo = account_status => {
    const poa_status = account_status?.authentication?.document?.status;
    const poi_status = account_status?.authentication?.identity?.status;

    const idv_status = account_status?.authentication?.identity?.services?.idv?.status;
    const onfido_status = account_status?.authentication?.identity?.services?.onfido?.status;
    const manual_status = account_status?.authentication?.identity?.services?.manual?.status;

    const acknowledged_status = ['pending', 'verified'];

    const poi_acknowledged_for_vanuatu =
        (onfido_status && acknowledged_status.includes(onfido_status)) ||
        (manual_status && acknowledged_status.includes(manual_status));

    const need_poi_for_vanuatu = !poi_acknowledged_for_vanuatu;

    const poi_acknowledged_for_bvi_labuan =
        (idv_status && acknowledged_status.includes(idv_status)) ||
        (onfido_status && acknowledged_status.includes(onfido_status)) ||
        (manual_status && acknowledged_status.includes(manual_status));
    const need_poi_for_bvi_labuan = !poi_acknowledged_for_bvi_labuan;

    const poa_acknowledged = acknowledged_status.includes(poa_status);
    const poi_acknowledged = acknowledged_status.includes(poi_status);
    const poa_poi_verified = poa_status === 'verified' && poi_status === 'verified';

    const need_poa_submission = !poa_acknowledged;

    const idv_acknowledged = idv_status && acknowledged_status.includes(idv_status);

    const poi_verified_for_vanuatu = onfido_status === 'verified' || manual_status === 'verified';
    const poi_verified_for_labuan_bvi =
        idv_status === 'verified' || onfido_status === 'verified' || manual_status === 'verified';
    const poa_verified = poa_status === 'verified';

    return {
        poa_status,
        poi_status,
        idv_status,
        onfido_status,
        manual_status,
        acknowledged_status,
        poi_acknowledged_for_vanuatu,
        poa_acknowledged,
        poi_acknowledged,
        poa_poi_verified,
        idv_acknowledged,
        need_poi_for_vanuatu,
        need_poi_for_bvi_labuan,
        poi_acknowledged_for_bvi_labuan,
        need_poa_submission,
        poi_verified_for_vanuatu,
        poi_verified_for_labuan_bvi,
        poa_verified,
    };
};
