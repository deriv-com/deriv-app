import { TSocketEndpointNames, TSocketError } from '@deriv/api-v2/types';
import { API_ERROR_CODES, POI_SUBMISSION_STATUS } from '../constants';

type TPOISubmissionStatus = typeof POI_SUBMISSION_STATUS[keyof typeof POI_SUBMISSION_STATUS];

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
