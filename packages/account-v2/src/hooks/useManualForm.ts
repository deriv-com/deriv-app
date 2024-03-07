import { useKycAuthStatus } from '@deriv/api-v2';
import { manualDocumentTypes, TManualDocumentTypes } from '../constants/manualFormConstants';

/** A custom hook used for manual verification flow */
const useManualForm = (countryCode: string, selectedDocument: TManualDocumentTypes) => {
    const { isLoading, kyc_auth_status: kycAuthStatus, ...rest } = useKycAuthStatus({ country: countryCode });
    const servicesAvailable = kycAuthStatus?.identity?.available_services;

    if (countryCode === 'ng') {
        if (selectedDocument === manualDocumentTypes.nimcSlip) {
            return {
                isExpiryDateRequired: false,
                isLoading,
                poiService: 'manual',
                ...rest,
            };
        }
        return {
            isExpiryDateRequired: true,
            isLoading,
            poiService: isLoading || !servicesAvailable?.length ? null : servicesAvailable[0],
            ...rest,
        };
    }
    return {
        isExpiryDateRequired: true,
        isLoading,
        poiService: 'manual',
        ...rest,
    };
};

export default useManualForm;
