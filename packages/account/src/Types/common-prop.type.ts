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

export type TInputFieldValues = Record<string, string>;

export type TIDVForm = {
    document_type: {
        id: string;
        text: string;
        value: string;
        example_format: string;
        sample_image: string;
        additional?: string;
    };
    document_number: string;
    document_additional?: string;
};

export type TPersonalDetailsForm = {
    first_name: string;
    last_name: string;
    date_of_birth: string;
};

export type TIDVErrorStatus =
    | 'POI_NAME_DOB_MISMATCH'
    | 'POI_DOB_MISMATCH'
    | 'POI_NAME_MISMATCH'
    | 'POI_EXPIRED'
    | 'POI_FAILED';
