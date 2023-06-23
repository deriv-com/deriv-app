/** Add types that are shared between components */

import { FormikProps, FormikValues } from 'formik';
import { Authorize, ResidenceList } from '@deriv/api-types';
import { Redirect } from 'react-router-dom';

export type TToken = {
    display_name: string;
    last_used: string;
    scopes: string[];
    token: string;
};

export type TPoaStatusProps = {
    needs_poi: boolean;
    redirect_button: React.ReactNode;
};

export type TAuthAccountInfo = NonNullable<Authorize['account_list']>[0] & {
    landing_company_shortcode?: string;
};

export type TCurrencyConfig = {
    fractional_digits: number;
    is_deposit_suspended: 0 | 1;
    is_suspended: 0 | 1;
    is_withdrawal_suspended: 0 | 1;
    name: string;
    stake_default: number;
    transfer_between_accounts: {
        fees: {
            [key: string]: number;
        };
        limits: {
            max: number;
            min: number;
        } | null;
    };
    type: 'fiat' | 'crypto';
    value: string;
};

export type TFormValidation = {
    warnings: { [key: string]: string };
    errors: { [key: string]: string };
};

export type TRealAccount = {
    active_modal_index: number;
    current_currency: string;
    error_message: string;
    previous_currency: string;
    success_message: string;
    error_code: number;
    error_details?: Record<string, string>;
};

export type TPopoverAlignment = 'top' | 'right' | 'bottom' | 'left';

export type TRoute = {
    exact?: boolean;
    id?: string;
    icon_component?: string;
    is_invisible?: boolean;
    path?: string;
    icon?: string;
    default?: boolean;
    to?: string;
    component?: ((cashier_routes?: TRoute[]) => JSX.Element) | typeof Redirect;
    getTitle?: () => string;
    subroutes?: TRoute[];
};

export type TRouteConfig = TRoute & {
    is_modal?: boolean;
    is_authenticated?: boolean;
    routes?: TRoute[];
};

export type TBinaryRoutes = {
    is_logged_in: boolean;
    is_logging_in: boolean;
};

export type TPOIStatus = {
    needs_poa?: boolean;
    redirect_button?: React.ReactElement;
    is_from_external?: boolean;
    is_manual_upload?: boolean;
};

export type TPersonalDetailsForm = {
    warning_items?: Record<string, string>;
    is_virtual?: boolean;
    is_mf?: boolean;
    is_svg?: boolean;
    is_qualified_for_idv?: boolean;
    should_hide_helper_image: boolean;
    is_appstore?: boolean;
    editable_fields: Array<string>;
    has_real_account?: boolean;
    residence_list?: ResidenceList;
    is_fully_authenticated?: boolean;
    account_opening_reason_list?: Record<string, string>[];
    closeRealAccountSignup: () => void;
    salutation_list?: Record<string, string>[];
    is_rendered_for_onfido?: boolean;
    should_close_tooltip?: boolean;
    setShouldCloseTooltip?: (should_close_tooltip: boolean) => void;
} & FormikProps<FormikValues>;

export type TInputFieldValues = Record<string, string>;
