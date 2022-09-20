import { DetailsOfEachMT5Loginid } from '@deriv/api-types';

export type ArrayElement<ArrayType extends readonly unknown[]> = ArrayType extends readonly (infer ElementType)[]
    ? ElementType
    : never;

export type RequiredAndNotNull<T> = {
    [P in keyof T]-?: Exclude<T[P], null | undefined>;
};

export type TAccountCategory = 'real' | 'demo';
export type TPlatform = 'dxtrade' | 'mt5';
export type TMarketType = 'financial' | 'synthetic';
export type TVisibilityChecker = (platform: TPlatform) => boolean;

export type TMissingRealAccount = {
    onClickSignup: () => void;
};

export type TMt5StatusServerType = {
    all: number;
    platform: number;
    server_number: number;
};

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

export type TCategotyTypes = {
    real: boolean;
    demo: boolean;
};

export type TDetailsOfEachMT5Loginid = DetailsOfEachMT5Loginid & {
    display_login: string;
};

export type TCFDAccountsProps = {
    isDerivedVisible: TVisibilityChecker;
    isFinancialVisible: TVisibilityChecker;
    isDerivXVisible: TVisibilityChecker;
    is_eu: boolean;
    is_eu_country: boolean;
    is_loading: boolean;
    is_logged_in: boolean;
    has_cfd_account_error: (platform: TPlatform) => boolean;
    current_list: Record<string, TDetailsOfEachMT5Loginid>;
    is_virtual: boolean;
    isAccountOfTypeDisabled: (account: Record<string, DetailsOfEachMT5Loginid>) => boolean;
    has_real_account: boolean;
    standpoint: TStandPoint;
    residence: string;
    should_enable_add_button: boolean;
};
