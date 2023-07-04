import { DetailsOfEachMT5Loginid } from '@deriv/api-types';
import { PlatformIcons } from 'Assets/svgs/trading-platform';
import { RegionAvailability } from 'Constants/platform-config';

export type ArrayElement<ArrayType extends readonly unknown[]> = ArrayType extends readonly (infer ElementType)[]
    ? ElementType
    : never;

export type RequiredAndNotNull<T> = {
    [P in keyof T]-?: Exclude<T[P], null | undefined>;
};

export type TRegionAvailability = 'Non-EU' | 'EU' | 'All';
export type TAccountCategory = 'real' | 'demo';
export type TPlatform = 'dxtrade' | 'mt5' | 'trader' | 'dbot' | 'smarttrader' | 'bbot' | 'go' | 'derivez';
export type TBrandData = {
    name: string;
    icon?: string;
    availability?: TRegionAvailability;
};

export type TBrandConfig = Record<TPlatform, TBrandData>;
export type TMarketType = 'financial' | 'synthetic' | 'all';
export type TVisibilityChecker = (platform: TPlatform) => boolean;

export type TMissingRealAccount = {
    onClickSignup: () => void;
};

export type TMt5StatusServerType = Record<'all' | 'platform' | 'server_number', number>;
export type TMt5StatusServer = Record<TAccountCategory, TMt5StatusServerType[]>;
export type TObjectCFDAccount = { category: string; type: string; set_password?: number; platform?: string };

export type TOpenAccountTransferMeta = {
    category: string;
    type?: string;
};

export type TStandPoint = {
    financial_company: string;
    gaming_company: string;
    iom: boolean;
    malta: boolean;
    maltainvest: boolean;
    svg: boolean;
};

export type TCategotyTypes = Record<TAccountCategory, boolean>;

export type TJurisdictionData = Record<
    'jurisdiction',
    'bvi' | 'labuan' | 'svg' | 'vanuatu' | 'maltainvest' | 'malta' | 'seychelles' | undefined
>;

export type TDetailsOfEachMT5Loginid = DetailsOfEachMT5Loginid & {
    display_login?: string;
    landing_company_short?: string;
    short_code_and_region?: string;
    mt5_acc_auth_status?: string | null;
    selected_mt5_jurisdiction?: TOpenAccountTransferMeta &
        TJurisdictionData & {
            platform?: string;
        };

    openFailedVerificationModal?: (from_account: string) => void;
};

export type TTradingPlatformAvailableAccount = {
    market_type: 'financial' | 'gaming' | 'all';
    name: string;
    requirements: {
        after_first_deposit: {
            financial_assessment: string[];
        };
        compliance: {
            mt5: string[];
            tax_information: string[];
        };
        signup: string[];
    };
    shortcode: 'bvi' | 'labuan' | 'svg' | 'vanuatu' | 'maltainvest';
    sub_account_type: string;
};

export type TCFDAccountsProps = {
    isDerivedVisible: TVisibilityChecker;
    isFinancialVisible: TVisibilityChecker;
    has_cfd_account_error: (platform: TPlatform) => boolean;
    current_list: Record<string, TDetailsOfEachMT5Loginid>;
    available_accounts: Array<TTradingPlatformAvailableAccount>;
    has_real_account?: boolean;
};

export type TCFDPlatforms = 'Derived' | 'Financial' | 'Deriv X' | 'CFDs';

export type TStaticAccountProps = {
    name: 'Derived' | 'Financial' | 'Deriv X' | 'CFDs';
    description: string;
    is_visible: boolean;
    disabled: boolean;
    platform: TPlatform;
    type: TMarketType;
};

export type TIconTypes =
    | 'Derived'
    | 'Financial'
    | 'BinaryBot'
    | 'BinaryBotBlue'
    | 'DBot'
    | 'Demo'
    | 'DerivGo'
    | 'DerivGoBlack'
    | 'DerivLogo'
    | 'DerivTradingLogo'
    | 'DerivX'
    | 'DropDown'
    | 'DTrader'
    | 'Options'
    | 'SmartTrader'
    | 'SmartTraderBlue'
    | 'CFDs'
    | 'DerivEz';

export interface AvailableAccount {
    name: string;
    is_item_blurry?: boolean;
    has_applauncher_account?: boolean;
    sub_title?: string;
    description?: string;
    is_visible?: boolean;
    is_disabled?: boolean;
    platform?: string;
    market_type?: 'all' | 'financial' | 'synthetic';
    icon: keyof typeof PlatformIcons;
    availability: RegionAvailability;
}

export type Currency =
    | 'AUD'
    | 'BCH'
    | 'BTC'
    | 'BUSD'
    | 'DAI'
    | 'ETH'
    | 'EURCHECK'
    | 'EUR'
    | 'EURS'
    | 'EUSDT'
    | 'GBP'
    | 'IDK'
    | 'LTC'
    | 'PAX'
    | 'TUSD'
    | 'TUSDT'
    | 'UNKNOWN'
    | 'USD'
    | 'USDC'
    | 'USDK'
    | 'UST'
    | 'VIRTUAL';

export interface AccountListDetail {
    icon: Currency;
    is_disabled: boolean;
    is_virtual: boolean;
    loginid: string;
    title: string;
}
