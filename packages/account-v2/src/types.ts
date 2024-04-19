import { useGetAccountStatus, useKycAuthStatus, useSettings } from '@deriv/api-v2';
import { AUTH_STATUS_CODES, getPaymentMethodsConfig, PAYMENT_METHOD_IDENTIFIER } from './constants';

export type TSupportedDocuments = Exclude<
    Exclude<ReturnType<typeof useKycAuthStatus>['kyc_auth_status'], undefined>['identity']['supported_documents'],
    undefined
>['idv'];

export type TSupportedPOIServices = Exclude<
    ReturnType<typeof useKycAuthStatus>['kyc_auth_status'],
    undefined
>['identity']['service'];

export type TPOIStatus = Exclude<
    ReturnType<typeof useKycAuthStatus>['kyc_auth_status'],
    undefined
>['identity']['status'];

export type TGetSettingsResponse = ReturnType<typeof useSettings>['data'];

export type TAuthStatusCodes = typeof AUTH_STATUS_CODES[keyof typeof AUTH_STATUS_CODES];

export type TPaymentMethod = keyof ReturnType<typeof getPaymentMethodsConfig>;

export type TPaymentMethodIdentifier = typeof PAYMENT_METHOD_IDENTIFIER[keyof typeof PAYMENT_METHOD_IDENTIFIER];

export type TPaymentMethodInfo = {
    documentsRequired?: number;
    icon: JSX.Element;
    identifier: TPaymentMethodIdentifier | '';
    inputLabel: string | null;
    instructions: JSX.Element;
    isGenericPM: boolean;
    items: Exclude<
        Exclude<
            Exclude<ReturnType<typeof useGetAccountStatus>['data'], undefined>['authentication'],
            undefined
        >['ownership'],
        undefined
    >['requests'];
    paymentMethod: string;
};
