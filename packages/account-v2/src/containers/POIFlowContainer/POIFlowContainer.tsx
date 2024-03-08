import React from 'react';
import { useKycAuthStatus } from '@deriv/api-v2';
import { Loader } from '@deriv-com/ui';
import { IDVService, OnfidoContainer } from '../../modules';

type TPOIFlowContainerProps = {
    countryCode: string;
};

export const POIFlowContainer = ({ countryCode }: TPOIFlowContainerProps) => {
    console.log('Country code: ', countryCode);
    const { isLoading, kyc_auth_status: kycAuthStatus } = useKycAuthStatus({ country: countryCode });

    if (isLoading || !kycAuthStatus) {
        return <Loader />;
    }

    const {
        identity: { available_services: availableServices, supported_documents: supportedDocuments },
    } = kycAuthStatus;

    // [TODO] - Add other services
    switch (availableServices?.[0]) {
        case 'onfido': {
            return <OnfidoContainer country={countryCode} />;
        }
        case 'idv': {
            return <IDVService supportedDocuments={supportedDocuments?.idv} />;
        }
        default: {
            return <>Default</>;
        }
    }
};
