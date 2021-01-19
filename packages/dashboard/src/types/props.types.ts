import { GetFinancialAssessment, GetSettings, ResidenceList, StatesList } from '@deriv/api-types';
import { ResidenceListItem } from './api.types';

export type TClientProps = {
    is_logged_in: boolean;
    loginid: string;
    readonly email_address: string;
    readonly has_active_real_account: () => boolean;
    readonly upgradeable_currencies: () => string[];
    currency: string;
    currencies_list: unknown;
    fetchResidenceList: () => void;
    fetchStatesList: () => void;
    fetchFinancialAssessment: () => void;
    needs_financial_assessment: () => boolean;
    financial_assessment: GetFinancialAssessment;
    residence_list: ResidenceList;
    states_list: StatesList;
    account_settings: GetSettings;
    is_fully_authenticated: () => boolean;
    realAccountSignup: () => void;
    upgrade_info: any;
    has_currency: () => boolean;
    setAccountCurrency: () => void;
    has_real_account: () => boolean;
    residence: ResidenceListItem;
    upgradeable_landing_companies: string[];
};

export type TConfigProps = {
    asset_path: string;
    has_router: boolean;
    is_deriv_crypto: boolean;
    routes: TRoutesProps;
};

export type TRoutesProps = {
    home: string;
    about_us: string;
    explore: string;
    resources: string;
};

export interface TUIProps {
    height_offset: string;
    is_dark_mode_on: boolean;
    components: {
        LoginPrompt: React.ComponentType | React.ElementType | null;
        Page404: React.ComponentType | React.ElementType | null;
    };
    real_account_signup: unknown;
    resetRealAccountSignupParams: () => void;
    openRealAccountSignup: () => void;
    real_account_signup_target: string;
}
