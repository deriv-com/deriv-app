import React, { useEffect, useState } from 'react';
import { DerivLightWaitingPoaIcon } from '@deriv/quill-icons';
import { Button, Loader, Text } from '@deriv-com/ui';
import { IconWithMessage } from 'src/components';
import { AUTH_STATUS_CODES } from 'src/constants';
import { POOForm } from 'src/containers';
import { usePaymentMethodDetails } from 'src/hooks';
import { TAuthStatusCodes } from 'src/types';

export const ProofOfOwnership = () => {
    const { isLoading, ownershipStatus, paymentMethodData } = usePaymentMethodDetails();

    const [status, setStatus] = useState<TAuthStatusCodes>();

    useEffect(() => {
        setStatus(ownershipStatus as TAuthStatusCodes);
    }, [ownershipStatus]);

    if (isLoading) {
        return <Loader isFullScreen />;
    }

    if (Object.keys(paymentMethodData)?.length && status !== AUTH_STATUS_CODES.REJECTED) {
        return <POOForm paymentMethodData={paymentMethodData} />;
    }

    switch (status) {
        case AUTH_STATUS_CODES.VERIFIED: {
            // TODO: Use actual icon once available in Quill
            return (
                <IconWithMessage icon={<DerivLightWaitingPoaIcon />} title='Proof of ownership verification passed.' />
            );
        }
        case AUTH_STATUS_CODES.PENDING: {
            // TODO: Use actual icon once available in Quill
            return (
                <IconWithMessage icon={<DerivLightWaitingPoaIcon />} title='We’ve received your proof of ownership.'>
                    <Text align='center' size='xs'>
                        We’ll review your documents and notify you of its status within 3 days.
                    </Text>
                </IconWithMessage>
            );
        }
        case AUTH_STATUS_CODES.REJECTED: {
            // TODO: Use actual icon once available in Quill
            return (
                <IconWithMessage
                    actionButton={<Button onClick={() => setStatus(AUTH_STATUS_CODES.NONE)}>Try again</Button>}
                    icon={<DerivLightWaitingPoaIcon />}
                    title='Proof of ownership verification failed.'
                >
                    <Text align='center' size='xs'>
                        We were unable to verify your proof of ownership.
                    </Text>
                </IconWithMessage>
            );
        }
        default: {
            // TODO: Use actual icon once available in Quill
            return (
                <IconWithMessage icon={<DerivLightWaitingPoaIcon />} title="Your proof of ownership isn't required.">
                    <Text align='center' size='xs'>
                        You are not required to submit proof of ownership at this time. We will inform you if proof of
                        ownership is required in the future.
                    </Text>
                </IconWithMessage>
            );
        }
    }
};
