import React, { useState } from 'react';
import { Button } from '@deriv-com/ui/dist/components/Button';
import { Text } from '@deriv-com/ui/dist/components/Text';
import { useActiveAccount } from '../../../../api/src/hooks';
import { AUTH_STATUS_CODES, P2P_ROUTE } from '../../constants/constants';
import { AddressDetailsForm as ProofOfAddressForm } from '../../containers/POAForm/AddressDetailsForm';
import {
    DemoMessage,
    Expired,
    NeedsReview,
    NotRequired,
    Submitted,
    Unverified,
    Verified,
} from '../../containers/POAForm/Status';
import usePOAInfo from '../../hooks/usePOAInfo';
import { isNavigationFromP2P } from '../../utils/platform';

export const POAFormContainer = () => {
    const { data: activeAccount } = useActiveAccount();
    const { data: poaInfo, isLoading } = usePOAInfo(activeAccount?.landing_company_name ?? '');
    const [resubmitting, setResubmitting] = useState(false);

    const { documentNotRequired, documentStatus, documentSubmitted, isPOAResubmission, isPOINeeded } = poaInfo;

    const handleResubmit = () => {
        setResubmitting(true);
    };

    const redirectButton = isNavigationFromP2P() && (
        <Button
            onClick={() => {
                window.location.href = P2P_ROUTE;
                window.sessionStorage.removeItem('config.platform');
            }}
        >
            Back to P2P
        </Button>
    );

    if (activeAccount?.is_virtual) return <DemoMessage />;

    if (isLoading) return <Text>Loading ...</Text>;

    if (documentNotRequired) return <NotRequired />;

    if (documentSubmitted) return <Submitted needsPOI={isPOINeeded} redirectButton={redirectButton} />;

    if (resubmitting || isPOAResubmission) {
        return <ProofOfAddressForm resubmitting />;
    }

    switch (documentStatus) {
        case AUTH_STATUS_CODES.NONE:
            return <ProofOfAddressForm />;
        case AUTH_STATUS_CODES.PENDING:
            return <NeedsReview needsPOI={isPOINeeded} redirectButton={redirectButton} />;
        case AUTH_STATUS_CODES.VERIFIED:
            return <Verified needsPOI={isPOINeeded} redirectButton={redirectButton} />;
        case AUTH_STATUS_CODES.EXPIRED:
            return <Expired onClick={handleResubmit} />;
        case AUTH_STATUS_CODES.REJECTED:
        case AUTH_STATUS_CODES.SUSPECTED:
            return <Unverified onClick={handleResubmit} />;
        default:
            return null;
    }
};
