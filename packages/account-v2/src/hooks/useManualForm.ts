import { useKycAuthStatus } from '@deriv/api-v2';
import { MANUAL_DOCUMENT_TYPES, TManualDocumentTypes } from '../constants/manualFormConstants';

/** A custom hook used for manual verification flow */
const useManualForm = (countryCode: string, selectedDocument: TManualDocumentTypes) => {
    const { isLoading, kyc_auth_status, ...rest } = useKycAuthStatus({ country: countryCode });
    const servicesAvailable = kyc_auth_status?.identity?.available_services;

    if (countryCode === 'ng') {
        if (selectedDocument === MANUAL_DOCUMENT_TYPES.NIMC_SLIP) {
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
