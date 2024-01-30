import React from 'react';
import { useHistory } from 'react-router-dom';
import { Button } from '@deriv-com/ui/dist/components/Button';
import { Text } from '@deriv-com/ui/dist/components/Text';
import IcPOAVerified from '../../../../assets/verification-status/ic-poa-verified.svg';
import { isNavigationFromDerivGO, isNavigationFromP2P } from '../../../../utils/platform';
import POAStatus from '../POAStatus';

type TPOANeedsReview = {
    needsPOI: boolean;
    redirectButton?: React.ReactNode;
};

export const NeedsReview = ({ needsPOI = true, redirectButton }: TPOANeedsReview) => {
    const history = useHistory();
    const isRedirectedFromPlatform = isNavigationFromP2P() || isNavigationFromDerivGO();

    let actionButton = null;

    if (needsPOI) {
        actionButton = (
            <Button
                onClick={() => {
                    history.push('/account/proof-of-identity');
                }}
            >
                Proof of identity
            </Button>
        );
    } else if (redirectButton) {
        actionButton = redirectButton;
    } else if (!isRedirectedFromPlatform) {
        actionButton = (
            <Button
                onClick={() => {
                    history.push('/');
                }}
            >
                Continue trading
            </Button>
        );
    }

    return (
        <POAStatus
            actionButton={actionButton}
            icon={<IcPOAVerified width={128} />}
            title='Your proof of address was submitted successfully'
        >
            <Text align='center' size='sm'>
                Your document is being reviewed, please check back in 1-3 days.
            </Text>
            {needsPOI ? (
                <Text align='center' size='sm'>
                    You must also submit a proof of identity.
                </Text>
            ) : null}
        </POAStatus>
    );
};
