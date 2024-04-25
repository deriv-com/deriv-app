import { useKycAuthStatus, useSettings } from '@deriv/api-v2';
import { CurrencyConstants } from '@deriv-com/utils';
import { IDV_ERROR_CODES, POI_SERVICE } from './constants';

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

export type TCurrency = CurrencyConstants.Currency;
export type TPOIService = typeof POI_SERVICE[keyof typeof POI_SERVICE];

export type TIDVErrorStatusCode = typeof IDV_ERROR_CODES[keyof typeof IDV_ERROR_CODES]['code'];
