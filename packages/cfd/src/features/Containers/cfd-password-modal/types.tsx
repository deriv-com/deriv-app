import { FormikErrors, FormikHelpers } from 'formik';

export type TCFDPasswordFormValues = { password: string };

export type TOnSubmitPassword = (
    values: TCFDPasswordFormValues,
    actions: FormikHelpers<TCFDPasswordFormValues>
) => void;

export type TCFDPasswordFormReusedProps = {
    platform: string;
    error_message: string;
    validatePassword: (values: TCFDPasswordFormValues) => FormikErrors<TCFDPasswordFormValues>;
};
