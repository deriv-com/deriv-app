import { TAddedMT5Account, TAvailableMT5Account } from '../types';

const requiredDocumentStatuses = ['expired', 'none', 'rejected', 'suspected'];

export const getClientVerification = (account: TAddedMT5Account | TAvailableMT5Account) => {
    const hasClientKycStatus = 'client_kyc_status' in account;
    const documentStatuses = account.client_kyc_status;

    const hasPoiStatus = hasClientKycStatus && 'poi_status' in documentStatuses;
    const hasPoaStatus = hasClientKycStatus && 'poa_status' in documentStatuses;
    const hasTinStatus = hasClientKycStatus && 'valid_tin' in documentStatuses;

    const isPoiRequired = hasPoiStatus && requiredDocumentStatuses.includes(documentStatuses.poi_status);
    const isPoaRequired = hasPoaStatus && requiredDocumentStatuses.includes(documentStatuses.poa_status);
    const isTinRequired = hasTinStatus && !documentStatuses.valid_tin;

    return {
        hasClientKycStatus,
        hasPoaStatus,
        hasPoiStatus,
        hasTinStatus,
        isPoaRequired,
        isPoiRequired,
        isTinRequired,
        isVerificationRequired: isPoiRequired || isPoaRequired || isTinRequired,
        statuses: documentStatuses,
    };
};
