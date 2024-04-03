import React from 'react';
import { useKycAuthStatus } from '@deriv/api-v2';
import { Loader } from '@deriv-com/ui';
import { POI_SERVICE } from '../../constants';
import { ErrorList } from '../../containers';
import { translateErrorCode } from '../../utils';
import { OnfidoContainer } from '..';

type TOnfidoServiceProps = {
    countryCode: string;
    handleComplete: () => void;
};

export const OnfidoService = ({ countryCode, handleComplete }: TOnfidoServiceProps) => {
    const payload = countryCode ? { country: countryCode } : undefined;

    const { isLoading: isLoadingKycAuthStatus, kyc_auth_status: kycAuthStatus } = useKycAuthStatus(payload);

    if (isLoadingKycAuthStatus) {
        return <Loader />;
    }
    const errorMessageList =
        kycAuthStatus?.identity?.last_rejected?.rejected_reasons?.map(errorCode =>
            translateErrorCode(errorCode, POI_SERVICE.onfido)
        ) ?? [];

    if (errorMessageList.length) {
        return <ErrorList errorList={errorMessageList} />;
    }

    return <OnfidoContainer countryCode={countryCode} onOnfidoSubmit={handleComplete} />;
};
