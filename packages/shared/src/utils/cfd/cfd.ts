import { CFD_PLATFORMS } from '../platform';
import { LandingCompany, GetAccountStatus, DetailsOfEachMT5Loginid } from '@deriv/api-types';
import { localize } from '@deriv/translations';

let CFD_text_translated: { [key: string]: () => void };

export const CFD_text: { [key: string]: string } = {
    dxtrade: 'Deriv X',
    mt5: 'MT5',
    mt5_cfds: 'MT5 CFDs',
    cfd: 'CFDs',
    synthetic: 'Derived',
    synthetic_demo: 'Derived Demo',
    synthetic_bvi: 'Derived BVI',
    synthetic_svg: 'Derived SVG',
    synthetic_v: 'Derived Vanuatu',
    financial: 'Financial',
    financial_demo: 'Financial Demo',
    financial_bvi: 'Financial BVI',
    financial_fx: 'Financial Labuan',
    financial_v: 'Financial Vanuatu',
    financial_svg: 'Financial SVG',
    all: 'Swap-Free',
    all_demo: 'Swap-Free Demo',
    all_svg: 'Swap-Free SVG',
} as const;

export const getMT5Title = (account_type: string) => {
    if (account_type === 'synthetic') {
        return CFD_text.synthetic;
    }
    if (account_type === 'all') {
        return CFD_text.all;
    }
    return CFD_text.financial;
};

type TPlatform = 'dxtrade' | 'mt5' | 'derivez';
type TMarketType = 'financial' | 'synthetic' | 'gaming' | 'all' | undefined;
type TShortcode = 'svg' | 'bvi' | 'labuan' | 'vanuatu';
type TGetAccount = {
    market_type: TMarketType;
    sub_account_type?: TAccount['sub_account_type'];
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
// dxrade and swap_free both have market_type "all" so check for platform is neccessary
export const getCFDAccountKey = ({ market_type, sub_account_type, platform, shortcode }: TGetCFDAccountKey) => {
    if (market_type === 'all') {
        if (platform === CFD_PLATFORMS.MT5) {
            // currently we are only supporting SVG for SwapFree
            switch (shortcode) {
                case 'svg':
                    return 'all_svg';
                default:
                    return 'all_demo';
            }
        } else {
            return platform === CFD_PLATFORMS.DERIVEZ ? 'derivez' : 'dxtrade';
        }
    }

    if (market_type === 'gaming' || market_type === 'synthetic') {
        if (platform === CFD_PLATFORMS.DXTRADE || sub_account_type === 'financial') {
            switch (shortcode) {
                case 'svg':
                    return 'synthetic_svg';
                case 'bvi':
                    return 'synthetic_bvi';
                case 'vanuatu':
                    return 'synthetic_v';
                default:
                    return 'synthetic_demo';
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
                    return 'financial_demo';
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
    type: 'financial' | 'synthetic' | 'all';
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
            all: {
                account_type: 'all',
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
            all: {
                account_type: 'demo',
            },
        },
    };

    return map_mode[category][type];
};

type TGetCFDAccountDisplay = TGetCFDAccountKey & {
    is_eu: boolean;
    is_mt5_trade_modal?: boolean;
    is_transfer_form?: boolean;
};

export const getCFDAccountDisplay = ({
    market_type,
    sub_account_type,
    platform,
    is_eu,
    shortcode,
    is_mt5_trade_modal,
    is_transfer_form = false,
}: TGetCFDAccountDisplay) => {
    let cfd_account_key = getCFDAccountKey({ market_type, sub_account_type, platform, shortcode });
    if (!cfd_account_key) return undefined;

    if (cfd_account_key === 'financial' && is_eu) {
        if (is_mt5_trade_modal) cfd_account_key = 'mt5_cfds';
        else cfd_account_key = 'cfd';
    }

    const cfd_account_display = CFD_text_translated[cfd_account_key]();

    // TODO condition will be changed when card 74063 is merged
    if (market_type === 'synthetic' && platform === CFD_PLATFORMS.DXTRADE) return localize('Synthetic');
    if (market_type === 'all' && platform === CFD_PLATFORMS.DXTRADE && is_transfer_form) return '';
    if (platform === CFD_PLATFORMS.DERIVEZ) return '';

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
        if (type === 'all') return !!landing_companies?.dxtrade_all_company?.standard;
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
    const poi_and_poa_not_submitted = poa_not_submitted && poi_not_submitted;

    //vanuatu-maltainvest

    const poi_verified_for_vanuatu_maltainvest = [onfido_status, manual_status].includes('verified');
    const poi_acknowledged_for_vanuatu_maltainvest =
        (onfido_status && acknowledged_status.includes(onfido_status)) ||
        (manual_status && acknowledged_status.includes(manual_status));

    const poi_pending_for_vanuatu_maltainvest =
        onfido_status &&
        manual_status &&
        [onfido_status, manual_status].includes('pending') &&
        !poi_verified_for_vanuatu_maltainvest;

    const need_poi_for_vanuatu_maltainvest = !poi_acknowledged_for_vanuatu_maltainvest;
    const poi_not_submitted_for_vanuatu_maltainvest =
        onfido_status && manual_status && [onfido_status, manual_status].every(status => status === 'none');
    const poi_resubmit_for_vanuatu_maltainvest =
        !poi_pending_for_vanuatu_maltainvest &&
        !poi_not_submitted_for_vanuatu_maltainvest &&
        !poi_verified_for_vanuatu_maltainvest;

    const poi_poa_verified_for_vanuatu_maltainvest = poi_verified_for_vanuatu_maltainvest && poa_verified;

    //bvi-labuan
    const poi_acknowledged_for_bvi_labuan =
        (idv_status && acknowledged_status.includes(idv_status)) ||
        (onfido_status && acknowledged_status.includes(onfido_status)) ||
        (manual_status && acknowledged_status.includes(manual_status));

    const need_poi_for_bvi_labuan = !poi_acknowledged_for_bvi_labuan;
    const poi_not_submitted_for_bvi_labuan =
        idv_status &&
        onfido_status &&
        manual_status &&
        [idv_status, onfido_status, manual_status].every(status => status === 'none');

    const poi_verified_for_bvi_labuan = [idv_status, onfido_status, manual_status].includes('verified');

    const poi_pending_for_bvi_labuan =
        idv_status &&
        onfido_status &&
        manual_status &&
        [idv_status, onfido_status, manual_status].includes('pending') &&
        !poi_verified_for_bvi_labuan;

    const poi_resubmit_for_bvi_labuan =
        !poi_pending_for_bvi_labuan && !poi_not_submitted_for_bvi_labuan && !poi_verified_for_bvi_labuan;
    const poi_poa_verified_for_bvi_labuan = poi_verified_for_bvi_labuan && poa_verified;

    return {
        poa_status,
        poi_status,
        idv_status,
        onfido_status,
        manual_status,
        acknowledged_status,
        poi_acknowledged_for_vanuatu_maltainvest,
        poi_poa_verified_for_bvi_labuan,
        poa_acknowledged,
        poi_poa_verified_for_vanuatu_maltainvest,
        need_poa_submission,
        poi_verified_for_vanuatu_maltainvest,
        poi_acknowledged_for_bvi_labuan,
        poi_verified_for_bvi_labuan,
        poa_verified,
        poi_or_poa_not_submitted,
        need_poa_resubmission,
        poi_and_poa_not_submitted,
        poa_not_submitted,
        poi_not_submitted,
        need_poi_for_vanuatu_maltainvest,
        need_poi_for_bvi_labuan,
        poi_not_submitted_for_vanuatu_maltainvest,
        poi_pending_for_bvi_labuan,
        poi_pending_for_vanuatu_maltainvest,
        poi_resubmit_for_vanuatu_maltainvest,
        poi_resubmit_for_bvi_labuan,
        poa_pending,
    };
};
