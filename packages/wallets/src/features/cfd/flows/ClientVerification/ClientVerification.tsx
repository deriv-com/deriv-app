import React, { useMemo, useState } from 'react';
import { useModal } from 'src/components/ModalProvider';
import { useMT5AccountsList, usePOA, usePOI, useSettings } from '@deriv/api-v2';
import { Loader } from '@deriv-com/ui';
import { THooks } from '../../../../types';
import { Poa, Poi, TaxInformation } from '../../../accounts';
import { MT5PasswordModal } from '../../modals';
import { ResubmissionSuccessMessage } from './components';

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
    const { data: mt5AccountsList, isLoading: isMT5AccountsListLoading } = useMT5AccountsList();
    const { getModalState } = useModal();

    const [isPoaJustCompleted, setIsPoaJustCompleted] = useState(false);
    const [isPoiJustCompleted, setIsPoiJustCompleted] = useState(false);
    const [isTaxInformationJustCompleted, setIsTaxInformationJustCompleted] = useState(false);

    const isLoading = isAccountSettingsLoading || isMT5AccountsListLoading || isPoaDataLoading || isPoiDataLoading;

    const clientsHasMT5Accounts = mt5AccountsList?.some(account => account.account_type === 'real');

    const isPoaRequired = useMemo(
        () =>
            !!(
                (
                    isSubmissionRequired[poaData?.status ?? 'none'] &&
                    selectedJurisdiction &&
                    // @ts-expect-error broken type for verified_jurisdiction key in type GetAccountStatusResponse
                    !poaData?.verified_jurisdiction?.[selectedJurisdiction]
                ) // if the value is 0 against selected jurisdiction, client needs to do POA
            ),
        // @ts-expect-error broken type for verified_jurisdiction key in type GetAccountStatusResponse
        [poaData?.status, poaData?.verified_jurisdiction, selectedJurisdiction]
    );

    const isPoiRequired = useMemo(
        () => poiData?.current.status && isSubmissionRequired[poiData?.current.status],
        [poiData]
    );

    const isTaxInformationRequired = useMemo(
        () => !accountSettings.has_submitted_personal_details,
        [accountSettings.has_submitted_personal_details]
    );

    const shouldSubmitPoi = isPoiRequired && !isPoiJustCompleted;

    const shouldSubmitPoa = isPoaRequired && !isPoaJustCompleted;

    const shouldSubmitTaxInformation = isTaxInformationRequired && !isTaxInformationJustCompleted;

    // client resubmits the docs if MT5 account is created but the verification of their docs fail
    const hasResubmittedDocuments =
        clientsHasMT5Accounts && !shouldSubmitPoi && !shouldSubmitPoa && !shouldSubmitTaxInformation;

    const onPoaCompletion = () => {
        setIsPoaJustCompleted(true);
    };
    const onPoiCompletion = () => {
        setIsPoiJustCompleted(true);
    };
    const onTaxInformationCompletion = () => {
        setIsTaxInformationJustCompleted(true);
    };

    if (isLoading) return <Loader />;

    if (shouldSubmitPoi) {
        return <Poi onCompletion={onPoiCompletion} />;
    }

    if (shouldSubmitPoa) {
        return <Poa onCompletion={onPoaCompletion} />;
    }

    if (shouldSubmitTaxInformation) {
        return <TaxInformation onCompletion={onTaxInformationCompletion} />;
    }

    if (hasResubmittedDocuments) {
        const resubmissionMessage =
            poiData?.current.service === 'manual'
                ? "We'll review your documents and notify you of its status within 1 - 3 working days."
                : "We'll review your documents and notify you of its status within 5 minutes.";

        return <ResubmissionSuccessMessage message={resubmissionMessage} />;
    }

    if (!hasResubmittedDocuments) {
        const marketType = getModalState('marketType') ?? 'all';
        const platform = getModalState('platform') ?? 'mt5';
        return <MT5PasswordModal marketType={marketType} platform={platform} />;
    }

    return null;
};

export default ClientVerification;
