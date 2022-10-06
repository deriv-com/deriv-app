// Todo: This is a workaround for overriding the wrong types in RootStore,
// Once we refactor the RootStore in Core package to TS we should be able to remove these overrides.

type TCoreRootStore = NonNullable<import('./Stores').default>;
type TClientStore = TCoreRootStore['client'];
type TCommonStore = TCoreRootStore['common'];
type TUIStore = TCoreRootStore['ui'];

type TError = {
    header: string | JSX.Element;
    message: string | JSX.Element;
    type?: string;
    redirect_label: string;
    redirect_to: string;
    should_clear_error_on_click: boolean;
    should_show_refresh: boolean;
    redirectOnClick: () => void;
    setError: (has_error: boolean, error: TError | null) => void;
};

interface TOverrideClientStore extends TClientStore {
    accounts: { [k: string]: NonNullable<NonNullable<import('@deriv/api-types').Authorize>['account_list']>[0] };
    balance: string | undefined;
    currency: string;
    current_fiat_currency: string | undefined;
    is_virtual: boolean;
    is_financial_information_incomplete: boolean;
    is_trading_experience_incomplete: boolean;
    account_status: NonNullable<import('@deriv/api-types').GetAccountStatus>;
    loginid: string;
    mt5_login_list: NonNullable<import('@deriv/api-types').DetailsOfEachMT5Loginid>[];
    current_currency_type: string | undefined;
    is_deposit_lock: boolean;
    is_withdrawal_lock: boolean;
    is_identity_verification_needed: boolean;
    account_limits: {
        daily_transfers?: {
            [k: string]: {
                allowed: boolean;
                available: boolean;
            };
        };
    };
    landing_company_shortcode: string;
    setVerificationCode: (code: string, action: string) => void;
    authentication_status: { document_status: string; identity_status: string };
    email: string;
}

interface TOverrideCommonStore extends Omit<TCommonStore, 'error'> {
    error: TError;
    routeTo: (pathname: string) => void;
    routeBackInApp: (
        history: Pick<NonNullable<import('react-router').RouteComponentProps>, 'history'>,
        additional_platform_path?: string[]
    ) => void;
}

interface TOverrideUIStore extends Omit<TUIStore, 'current_focus'> {
    current_focus: string | null;
    setCurrentFocus: (value: string) => void;
    is_dark_mode_on: boolean;
}

interface TOverrideRootStore extends Omit<TCoreRootStore, 'client' | 'common' | 'ui'> {
    client: TOverrideClientStore;
    common: TOverrideCommonStore;
    ui: TOverrideUIStore;
}

export type TRootStore = TOverrideRootStore;
