import React, { useEffect, useState } from 'react';
import { useGetAccountStatus } from '@deriv/api-v2';
import { DerivLightWaitingPoaIcon } from '@deriv/quill-icons';
import { Button, Loader, Text } from '@deriv-com/ui';
import { IconWithMessage } from 'src/components';
import { AUTH_STATUS_CODES } from 'src/constants';
import { TAuthStatusCodes } from 'src/types';

export const ProofOfOwnership = () => {
    const { data, isLoading } = useGetAccountStatus();

    const [status, setStatus] = useState<TAuthStatusCodes>();

    const ownership = data?.authentication?.ownership;

    useEffect(() => {
        setStatus(ownership?.status?.toLowerCase() as TAuthStatusCodes);
    }, [ownership?.status]);

    if (isLoading) {
        return <Loader isFullScreen />;
    }

    if (ownership?.requests?.length && status !== AUTH_STATUS_CODES.REJECTED) {
        return <div>ProofOfOwnership</div>;
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
