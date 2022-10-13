import { CFD_PLATFORMS } from '../platform';
import { LandingCompany, GetAccountStatus, DetailsOfEachMT5Loginid } from '@deriv/api-types';

let CFD_text_translated: { [key: string]: () => void };

// TODO: add swap_free to this file when ready
const CFD_text: { [key: string]: string } = {
    dxtrade: 'Deriv X',
    mt5: 'MT5',
    mt5_cfds: 'MT5 CFDs',
    cfd: 'CFDs',
    synthetic: 'Derived',
    synthetic_bvi: 'Derived BVI',
    synthetic_svg: 'Derived SVG',
    financial: 'Financial',
    financial_bvi: 'Financial BVI',
    financial_fx: 'Financial Labuan',
    financial_v: 'Financial Vanuatu',
    financial_svg: 'Financial SVG',
} as const;

type TPlatform = 'dxtrade' | 'mt5';
type TMarketType = 'financial' | 'synthetic' | 'gaming' | 'all' | undefined;
type TShortcode = 'svg' | 'bvi' | 'labuan' | 'vanuatu';
type TGetAccount = {
    market_type: TMarketType;
    sub_account_type?: 'financial' | 'financial_stp' | 'swap_free';
    platform: TPlatform;
};
type TGetCFDAccountKey = TGetAccount & {
    shortcode?: TShortcode;
};

// * mt5_login_list returns these:
// market_type: "financial" | "gaming"
// sub_account_type: "financial" | "financial_stp" | "swap_free"
// *
// sub_account_type financial_stp only happens in "financial" market_type
export const getCFDAccountKey = ({ market_type, sub_account_type, platform, shortcode }: TGetCFDAccountKey) => {
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

type TGetAccountTypeFields = {
    category: 'real' | 'demo';
    type: 'financial' | 'synthetic';
};

type TAccountType = {
    account_type: string;
    mt5_account_type?: string;
};

type TAccountTypes = Record<TGetAccountTypeFields['type'], TAccountType>;

type TMapMode = Record<TGetAccountTypeFields['category'], TAccountTypes>;

export const getAccountTypeFields = ({ category, type }: TGetAccountTypeFields) => {
    const map_mode: TMapMode = {
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

type TGetCFDAccountDisplay = TGetCFDAccountKey & {
    is_eu: boolean;
    is_mt5_trade_modal?: boolean;
};

export const getCFDAccountDisplay = ({
    market_type,
    sub_account_type,
    platform,
    is_eu,
    shortcode,
    is_mt5_trade_modal,
}: TGetCFDAccountDisplay) => {
    let cfd_account_key = getCFDAccountKey({ market_type, sub_account_type, platform, shortcode });
    if (!cfd_account_key) return undefined;

    if (cfd_account_key === 'financial' && is_eu) {
        if (is_mt5_trade_modal) cfd_account_key = 'mt5_cfds';
        else cfd_account_key = 'cfd';
    }

    const cfd_account_display = CFD_text_translated[cfd_account_key]();

    // TODO condition will be changed when card 74063 is merged
    if (market_type === 'synthetic' && platform === CFD_PLATFORMS.DXTRADE) return 'Synthetic';

    return cfd_account_display;
};

type TGetCFDAccount = TGetAccount & {
    is_eu?: boolean;
};

export const getCFDAccount = ({ market_type, sub_account_type, platform, is_eu }: TGetCFDAccount) => {
    let cfd_account_key = getCFDAccountKey({ market_type, sub_account_type, platform });
    if (!cfd_account_key) return undefined;

    if (cfd_account_key === 'financial' && is_eu) {
        cfd_account_key = 'cfd';
    }

    return CFD_text[cfd_account_key as keyof typeof CFD_text];
};

export const setSharedCFDText = (all_shared_CFD_text: { [key: string]: () => void }) => {
    CFD_text_translated = all_shared_CFD_text;
};

type TAccount = DetailsOfEachMT5Loginid & { platform: string };
export const getAccountListKey = (account: TAccount, platform: TPlatform, shortcode?: TShortcode) => {
    return `${account.platform || platform}.${account.account_type}.${getCFDAccountKey({
        market_type: account.market_type,
        sub_account_type: account.sub_account_type,
        platform,
        shortcode,
    })}@${platform === CFD_PLATFORMS.DXTRADE ? account.market_type : account.server}`;
};

export const getCFDPlatformLabel = (platform: TPlatform) => {
    switch (platform) {
        case CFD_PLATFORMS.MT5:
            return 'Deriv MT5';
        case CFD_PLATFORMS.DXTRADE:
            return 'Deriv X';
        default:
            return '';
    }
};

type TIsLandingCompanyEnabled = {
    landing_companies: LandingCompany;
    platform: TPlatform;
    type: TMarketType | 'financial_stp';
};

export const isLandingCompanyEnabled = ({ landing_companies, platform, type }: TIsLandingCompanyEnabled) => {
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

export const getAuthenticationStatusInfo = (account_status: GetAccountStatus) => {
    const poa_status = account_status?.authentication?.document?.status || '';
    const poi_status = account_status?.authentication?.identity?.status || '';

    const idv_status = account_status?.authentication?.identity?.services?.idv?.status;
    const onfido_status = account_status?.authentication?.identity?.services?.onfido?.status;
    const manual_status = account_status?.authentication?.identity?.services?.manual?.status;

    const acknowledged_status = ['pending', 'verified'];
    const failed_cases = ['rejected', 'expired', 'suspected'];

    const poa_not_submitted = poa_status === 'none';
    const poa_acknowledged = acknowledged_status.includes(poa_status);
    const need_poa_submission = !poa_acknowledged;
    const need_poa_resubmission = failed_cases.includes(poa_status);
    const poa_verified = poa_status === 'verified';
    const poa_pending = poa_status === 'pending';

    const poi_not_submitted = poi_status === 'none';
    const poi_or_poa_not_submitted = poa_not_submitted || poi_not_submitted;

    //vanuatu

    const poi_verified_for_vanuatu = [onfido_status, manual_status].includes('verified');
    const poi_acknowledged_for_vanuatu =
        (onfido_status && acknowledged_status.includes(onfido_status)) ||
        (manual_status && acknowledged_status.includes(manual_status));

    const poi_pending_for_vanuatu =
        onfido_status &&
        manual_status &&
        [onfido_status, manual_status].includes('pending') &&
        !poi_verified_for_vanuatu;

    const need_poi_for_vanuatu = !poi_acknowledged_for_vanuatu;
    const poi_not_submitted_for_vanuatu =
        onfido_status && manual_status && [onfido_status, manual_status].every(status => status === 'none');
    const poi_resubmit_for_vanuatu =
        !poi_pending_for_vanuatu && !poi_not_submitted_for_vanuatu && !poi_verified_for_vanuatu;

    const poi_poa_verified_for_vanuatu = poi_verified_for_vanuatu && poa_verified;

    //bvi-labuan-maltainvest
    const poi_acknowledged_for_bvi_labuan_maltainvest =
        (idv_status && acknowledged_status.includes(idv_status)) ||
        (onfido_status && acknowledged_status.includes(onfido_status)) ||
        (manual_status && acknowledged_status.includes(manual_status));

    const need_poi_for_bvi_labuan_maltainvest = !poi_acknowledged_for_bvi_labuan_maltainvest;
    const poi_not_submitted_for_bvi_labuan_maltainvest =
        idv_status &&
        onfido_status &&
        manual_status &&
        [idv_status, onfido_status, manual_status].every(status => status === 'none');

    const poi_verified_for_bvi_labuan_maltainvest = [idv_status, onfido_status, manual_status].includes('verified');

    const poi_pending_for_bvi_labuan_maltainvest =
        idv_status &&
        onfido_status &&
        manual_status &&
        [idv_status, onfido_status, manual_status].includes('pending') &&
        !poi_verified_for_bvi_labuan_maltainvest;

    const poi_resubmit_for_bvi_labuan_maltainvest =
        !poi_pending_for_bvi_labuan_maltainvest &&
        !poi_not_submitted_for_bvi_labuan_maltainvest &&
        !poi_verified_for_bvi_labuan_maltainvest;
    const poi_poa_verified_for_bvi_labuan_maltainvest = poi_verified_for_bvi_labuan_maltainvest && poa_verified;

    return {
        poa_status,
        poi_status,
        idv_status,
        onfido_status,
        manual_status,
        acknowledged_status,
        poi_acknowledged_for_vanuatu,
        poi_poa_verified_for_bvi_labuan_maltainvest,
        poa_acknowledged,
        poi_poa_verified_for_vanuatu,
        need_poa_submission,
        poi_verified_for_vanuatu,
        poi_acknowledged_for_bvi_labuan_maltainvest,
        poi_verified_for_bvi_labuan_maltainvest,
        poa_verified,
        poi_or_poa_not_submitted,
        need_poa_resubmission,
        poa_not_submitted,
        poi_not_submitted,
        need_poi_for_vanuatu,
        need_poi_for_bvi_labuan_maltainvest,
        poi_not_submitted_for_vanuatu,
        poi_pending_for_bvi_labuan_maltainvest,
        poi_pending_for_vanuatu,
        poi_resubmit_for_vanuatu,
        poi_resubmit_for_bvi_labuan_maltainvest,
        poa_pending,
    };
};
