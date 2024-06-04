import React from 'react';
import { useHistory } from 'react-router-dom';
import { DerivLightApprovedPoiIcon, DerivLightWaitingPoiIcon } from '@deriv/quill-icons';
import { Button, Text } from '@deriv-com/ui';
import { IconWithMessage } from '../../components/IconWithMessage';
import { ACCOUNT_V2_ROUTES, AUTH_STATUS_CODES, POI_SERVICE } from '../../constants';
import { TPOIStatus, TSupportedPOIServices } from '../../types';

type TVerificationStatusProps = {
    isPOARequired?: boolean;
    service: TSupportedPOIServices;
    status: TPOIStatus;
};

type TContinueActionButtonProps = {
    route: string;
    text: string;
};

const ContinueActionButton = ({ route, text }: TContinueActionButtonProps) => {
    const { push } = useHistory();
    return <Button onClick={() => push(route)}>{text}</Button>;
};

export const VerificationStatus = ({ isPOARequired, service, status }: TVerificationStatusProps) => {
    if (status === AUTH_STATUS_CODES.PENDING) {
        return (
            <IconWithMessage
                actionButton={
                    isPOARequired ? (
                        <ContinueActionButton route={ACCOUNT_V2_ROUTES.ProofOfAddress} text='Submit proof of address' />
                    ) : (
                        <ContinueActionButton route={ACCOUNT_V2_ROUTES.root} text='Continue trading' />
                    )
                }
                icon={<DerivLightWaitingPoiIcon height='128px' />}
                title='Your proof of identity was submitted successfully'
            >
                <Text align='center' size='xs'>
                    {service === POI_SERVICE.manual
                        ? "We'll review your documents and notify you of its status within 1-3 days."
                        : "We'll review your documents and notify you of its status within 5 minutes."}
                </Text>
            </IconWithMessage>
        );
    }
    return (
        <IconWithMessage
            actionButton={
                isPOARequired ? (
                    <ContinueActionButton route={ACCOUNT_V2_ROUTES.ProofOfAddress} text='Submit proof of address' />
                ) : (
                    <ContinueActionButton route={ACCOUNT_V2_ROUTES.root} text='Continue trading' />
                )
            }
            icon={<DerivLightApprovedPoiIcon />}
            title='ID verification passed'
        />
    );
};
