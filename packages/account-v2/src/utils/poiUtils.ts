import { TSocketEndpointNames, TSocketError } from '@deriv/api-v2/types';
import {
    API_ERROR_CODES,
    AUTH_STATUS_CODES,
    IDV_ERROR_CODES,
    ONFIDO_ERROR_CODES,
    POI_SERVICE,
    POI_SUBMISSION_STATUS,
} from '../constants';
import { TIDVErrorStatusCode, TPOIService, TPOIStatus } from '../types';

export type TPOISubmissionStatus = typeof POI_SUBMISSION_STATUS[keyof typeof POI_SUBMISSION_STATUS];

export type TPOIActions =
    | { payload: string; type: 'setSelectedCountry' }
    | { payload: TPOISubmissionStatus; type: 'setSubmissionStatus' };

export const setErrorMessage = <T extends TSocketError<TSocketEndpointNames>['error']>(error: T) => {
    const { code, message } = error ?? { code: null, message: null };
    switch (code) {
        case API_ERROR_CODES.duplicateAccount.code:
            return API_ERROR_CODES.duplicateAccount.message;
        case API_ERROR_CODES.claimedDocument.code:
            return API_ERROR_CODES.claimedDocument.message;
        default:
            return message ?? API_ERROR_CODES.generic.message;
    }
};

export const translateErrorCode = (errorCode: string | null, service: TPOIService) => {
    if (!errorCode) {
        return '';
    }
    if (service === 'idv') {
        return (
            Object.values(IDV_ERROR_CODES).find(error => error.code === errorCode)?.message ??
            IDV_ERROR_CODES.generic.message
        );
    }
    return (
        Object.values(ONFIDO_ERROR_CODES).find(error => error.code === errorCode)?.message ??
        ONFIDO_ERROR_CODES.generic.message
    );
};

type TIDVErrorStatusConfig = {
    errors?: string[];
    isReportAvailable?: 0 | 1;
    status?: TPOIStatus;
};

export const checkIDVErrorStatus = ({
    errors,
    isReportAvailable,
    status,
}: TIDVErrorStatusConfig): TIDVErrorStatusCode | null => {
    if (status === AUTH_STATUS_CODES.EXPIRED) {
        return IDV_ERROR_CODES.expired.code;
    }

    if (!errors?.length) {
        return null;
    }

    if (isReportAvailable === 0) {
        return IDV_ERROR_CODES.reportNotAvailable.code;
    }
    if (
        errors.includes(IDV_ERROR_CODES.nameMismatch.code as string) &&
        errors.includes(IDV_ERROR_CODES.dobMismatch.code as string)
    ) {
        return IDV_ERROR_CODES.nameDobMismatch.code;
    }
    return errors[0] as TIDVErrorStatusCode;
};

type TSkipCountrySelectorConfig = { errors?: string[]; isReportAvailable?: 0 | 1; service: TPOIService };

export const shouldSkipCountrySelector = ({ errors, isReportAvailable, service }: TSkipCountrySelectorConfig) => {
    if (service === POI_SERVICE.idv) {
        if (!errors?.length || isReportAvailable === 0) {
            return false;
        }
        const errorStatus = checkIDVErrorStatus({ errors });

        return (
            errorStatus === IDV_ERROR_CODES.nameMismatch.code ||
            errorStatus === IDV_ERROR_CODES.dobMismatch.code ||
            errorStatus === IDV_ERROR_CODES.nameDobMismatch.code
        );
    } else if (service === POI_SERVICE.onfido) {
        return true;
    }
    return false;
};
