import React from 'react';
import { Loader } from '@deriv-com/ui';
import { POI_SERVICE } from '../../constants/constants';
import { usePOIInfo } from '../../hooks';
import { IDVService, ManualUpload, OnfidoContainer } from '../../modules';

type TPOIFlowContainerProps = {
    countryCode: string;
    onCancel: () => void;
    onComplete: () => void;
};

export const POIFlowContainer = ({ countryCode, onCancel, onComplete }: TPOIFlowContainerProps) => {
    const payload = countryCode ? { country: countryCode } : undefined;
    const { isLoading, kycAuthStatus } = usePOIInfo(payload);

    if (isLoading || !kycAuthStatus) {
        return <Loader />;
    }

    const {
        identity: { available_services: availableServices },
    } = kycAuthStatus;

    switch (availableServices?.[0]) {
        case POI_SERVICE.onfido: {
            return <OnfidoContainer countryCode={countryCode} onOnfidoSubmit={onComplete} />;
        }
        case POI_SERVICE.idv: {
            return <IDVService countryCode={countryCode} handleComplete={onComplete} onCancel={onCancel} />;
        }
        default: {
            return <ManualUpload countryCode={countryCode} handleComplete={onComplete} onCancel={onCancel} />;
        }
    }
};
