import React, { useMemo, useState } from 'react';
import { usePOA, usePOI, useSettings } from '@deriv/api-v2';
import { Loader } from '../../../../components';
import { THooks } from '../../../../types';
import { Poa, Poi, TaxInformation } from '../../../accounts';

type TClientVerificationProps = {
    selectedJurisdiction?: string;
};
type TStatusCodes = Exclude<THooks.POA['status'] | THooks.POI['current']['status'], undefined>;

const isSubmissionRequired: Record<TStatusCodes, boolean> = {
    expired: true,
    none: true,
    pending: false,
    rejected: true,
    suspected: true,
    verified: false,
};

const ClientVerification: React.FC<TClientVerificationProps> = ({ selectedJurisdiction }) => {
    const { data: poiData, isLoading: isPoiDataLoading } = usePOI();
    const { data: poaData, isLoading: isPoaDataLoading } = usePOA();
    const { data: accountSettings, isLoading: isAccountSettingsLoading } = useSettings();

    const [isPoaJustCompleted, setIsPoaJustCompleted] = useState(false);
    const [isPoiJustCompleted, setIsPoiJustCompleted] = useState(false);

    const isLoading = isAccountSettingsLoading || isPoaDataLoading || isPoiDataLoading;

    const isPoaRequired = useMemo(
        () =>
            isSubmissionRequired[poaData?.status ?? 'none'] &&
            selectedJurisdiction &&
            // @ts-expect-error broken type for verified_jurisdiction key in type GetAccountStatusResponse
            poaData?.verified_jurisdiction?.[selectedJurisdiction],
        // @ts-expect-error broken type for verified_jurisdiction key in type GetAccountStatusResponse
        [poaData?.status, poaData?.verified_jurisdiction, selectedJurisdiction]
    );

    const isPoiRequired = useMemo(() => isSubmissionRequired[poiData?.current.status ?? 'none'], [poiData]);

    const isTaxInformationRequired = useMemo(
        () => !accountSettings.has_submitted_personal_details,
        [accountSettings.has_submitted_personal_details]
    );

    const shouldSubmitPoi = isPoiRequired && !isPoiJustCompleted;
    const shouldSubmitPoa = isPoaRequired && !isPoaJustCompleted;
    const shouldSubmitTaxInformation = isTaxInformationRequired && isPoaJustCompleted && !isPoaRequired;

    const onPoaCompletion = () => {
        setIsPoaJustCompleted(true);
    };
    const onPoiCompletion = () => {
        setIsPoiJustCompleted(true);
    };

    if (isLoading) return <Loader />;

    if (shouldSubmitPoi) {
        <Poi onCompletion={onPoiCompletion} />;
    }

    if (shouldSubmitPoa) {
        <Poa onCompletion={onPoaCompletion} />;
    }

    if (shouldSubmitTaxInformation) {
        <TaxInformation />;
    }

    return null;
};

export default ClientVerification;
