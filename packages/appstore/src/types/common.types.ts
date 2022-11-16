import { DetailsOfEachMT5Loginid } from '@deriv/api-types';

export type ArrayElement<ArrayType extends readonly unknown[]> = ArrayType extends readonly (infer ElementType)[]
    ? ElementType
    : never;

export type RequiredAndNotNull<T> = {
    [P in keyof T]-?: Exclude<T[P], null | undefined>;
};

export type TAccountCategory = 'real' | 'demo';
export type TPlatform = 'dxtrade' | 'mt5';
export type TMarketType = 'financial' | 'synthetic' | 'all';
export type TVisibilityChecker = (platform: TPlatform) => boolean;

export type TMissingRealAccount = {
    onClickSignup: () => void;
};

export type TMt5StatusServerType = Record<'all' | 'platform' | 'server_number', number>;

export type TMt5StatusServer = Record<'demo' | 'real', TMt5StatusServerType[]>;

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

export type TCategotyTypes = Record<'demo' | 'real', boolean>;

export type TDetailsOfEachMT5Loginid = DetailsOfEachMT5Loginid & {
    display_login?: string;
    landing_company_short?: string;
};

export type TTradingPlatformAvailableAccount = {
    market_type: 'financial' | 'gaming';
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
    shortcode: 'bvi' | 'labuan' | 'svg' | 'vanuatu';
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

export type TStaticAccountProps = {
    name: 'Derived' | 'Financial' | 'Deriv X' | 'CFDs';
    description: string;
    is_visible: boolean;
    disabled: boolean;
    platform: TPlatform;
    type: TMarketType;
};
