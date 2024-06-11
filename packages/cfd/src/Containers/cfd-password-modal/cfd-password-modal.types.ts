import { FormikErrors, FormikHelpers } from 'formik';

import { CFD_PLATFORMS } from '../../Helpers/cfd-config';

type TCFDPasswordFormValues = { password: string };

type TOnSubmitPassword = (values: TCFDPasswordFormValues, actions: FormikHelpers<TCFDPasswordFormValues>) => void;

type TPasswordModalHeaderProps = {
    should_set_trading_password: boolean;
    is_password_reset_error: boolean;
    platform: string;
    has_mt5_account?: boolean;
};

type TIconTypeProps = {
    platform: string;
    type?: string;
    show_eu_related_content: boolean;
};

type TCFDPasswordFormReusedProps = {
    platform: typeof CFD_PLATFORMS[keyof typeof CFD_PLATFORMS];
    error_message: string;
    validatePassword: (values: TCFDPasswordFormValues) => FormikErrors<TCFDPasswordFormValues>;
};

type TCFDCreatePasswordProps = TCFDPasswordFormReusedProps & {
    password: string;
    onSubmit: TOnSubmitPassword;
    is_real_financial_stp: boolean;
};

type TCFDCreatePasswordFormProps = TCFDPasswordFormReusedProps & {
    has_mt5_account: boolean;
    submitPassword: TOnSubmitPassword;
    is_real_financial_stp: boolean;
};

type TMultiStepRefProps = {
    goNextStep: () => void;
    goPrevStep: () => void;
};
type TReviewMsgForMT5 = {
    is_selected_mt5_verified: boolean;
    jurisdiction_selected_shortcode: string;
    manual_status: string;
};

type TCFDPasswordFormProps = TCFDPasswordFormReusedProps & {
    closeModal: () => void;
    error_type?: string;
    form_error?: string;
    has_mt5_account: boolean;
    is_bvi: boolean;
    is_dxtrade_allowed: boolean;
    is_real_financial_stp: boolean;
    onCancel: () => void;
    onForgotPassword: () => void;
    should_set_trading_password: boolean;
    submitPassword: TOnSubmitPassword;
};

type TCFDPasswordModalProps = {
    error_type?: string;
    form_error?: string;
    platform: typeof CFD_PLATFORMS[keyof typeof CFD_PLATFORMS];
};

export type {
    TCFDPasswordFormValues,
    TOnSubmitPassword,
    TPasswordModalHeaderProps,
    TIconTypeProps,
    TCFDPasswordFormReusedProps,
    TCFDCreatePasswordProps,
    TCFDCreatePasswordFormProps,
    TMultiStepRefProps,
    TReviewMsgForMT5,
    TCFDPasswordFormProps,
    TCFDPasswordModalProps,
};
