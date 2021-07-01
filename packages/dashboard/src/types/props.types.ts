import { GetFinancialAssessment, GetSettings, ResidenceList, StatesList } from '@deriv/api-types';
import { TCurrenciesList } from 'Types';
import { TUpgradeInfo } from './params.types';

export type TClientProps = {
    is_logged_in: boolean;
    loginid: string;
    email_address: string;
    currency: string;
    currencies_list: TCurrenciesList;
    financial_assessment: GetFinancialAssessment;
    residence_list: ResidenceList;
    states_list: StatesList;
    account_settings?: GetSettings;
    upgrade_info: TUpgradeInfo;
    residence: string;
    upgradeable_landing_companies: string[];
    has_active_real_account?: () => boolean;
    upgradeable_currencies?: () => string[];
    fetchResidenceList?: () => void;
    fetchStatesList?: () => void;
    fetchFinancialAssessment?: () => void;
    needs_financial_assessment?: () => boolean;
    is_fully_authenticated?: () => boolean;
    realAccountSignup?: () => Promise<void>;
    has_currency?: () => boolean;
    setAccountCurrency?: () => void;
    has_real_account?: () => boolean;
};

export type TConfigProps = {
    asset_path: string;
    has_router: boolean;
    routes: TRoutesProps;
};

export type TRoutesProps = {
    home: string;
    my_apps: string;
    about_us: string;
    explore: string;
    resources: string;

    market_commodities: string;
    market_forex: string;
    market_stock: string;
    market_synthetic: string;
    markets: string;

    platform_binary_bot: string;
    platform_dbot: string;
    platform_dmt5: string;
    platform_dmt5_financial: string;
    platform_dmt5_financial_stp: string;
    platform_dmt5_synthetic: string;
    platform_dtrader: string;
    platform_smarttrader: string;
    platforms: string;

    trade_type_cfds: string;
    trade_type_multipliers: string;
    trade_type_options: string;
    trade_types: string;

    wallet_bank_wire: string;
    wallet_cards: string;
    wallet_crypto: string;
    wallet_ewallet: string;
    wallets: string;
};

export interface TUIProps {
    height_offset: string;
    is_dark_mode_on: boolean;
    components: {
        Page404: React.ComponentType | React.ElementType | null;
    };
    real_account_signup: unknown;
    real_account_signup_target: string;
    resetRealAccountSignupParams?: () => void;
    openRealAccountSignup?: () => void;
}

type ReactTypes = React.ComponentType | React.ElementType;

type TLocalizeProps = {
    components?: ReactTypes[];
    i18n?: unknown;
    i18n_default_text: string;
    values?: {
        [k: string]: string;
    };
};

export type TStringTranslation = string | React.ReactElement<TLocalizeProps>;

// ref: https://www.carlrippon.com/react-children-with-typescript/
export type TReactChildren = React.ReactNode;
