import { THooks } from '../../../types';

export const getClientVerification = (account: THooks.SortedMT5Accounts) => {
    const hasClientKycStatus = 'client_kyc_status' in account;

    const isPoiRequired =
        hasClientKycStatus && 'poi_status' in account.client_kyc_status ? account.poi_status !== 'verified' : false;
    const isPoaRequired =
        hasClientKycStatus && 'poa_status' in account.client_kyc_status && account.poa_status !== 'verified';
    const isValidTin = hasClientKycStatus && 'valid_tin' in account.client_kyc_status && !!account.valid_tin;

    return {
        isPoaRequired,
        isPoiRequired,
        isValidTin,
        isVerificationRequired: isPoiRequired || isPoaRequired || isValidTin,
    };
};
