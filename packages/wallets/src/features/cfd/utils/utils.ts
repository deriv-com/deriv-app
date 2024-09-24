import { THooks } from '../../../types';

export const getClientVerification = (account: THooks.SortedMT5Accounts) => {
    if (!('client_kyc_status' in account)) {
        return false;
    }

    const isPoiRequired = 'poi_status' in account.client_kyc_status ? account.poi_status !== 'verified' : false;
    const isPoaRequired = 'poa_status' in account.client_kyc_status && account.poa_status !== 'verified';
    const isValidTin = 'valid_tin' in account.client_kyc_status && !!account.valid_tin;

    return {
        isPoaRequired,
        isPoiRequired,
        isValidTin,
        isVerificationRequired: isPoiRequired || isPoaRequired || isValidTin,
    };
};
