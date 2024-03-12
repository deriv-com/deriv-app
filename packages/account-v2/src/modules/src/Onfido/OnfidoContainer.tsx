import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';
import { useOnfido } from '@deriv/api-v2';
import { Button, Loader, Text } from '@deriv-com/ui';
import IcAccountMissingDetails from '../../../assets/proof-of-identity/ic-account-missing-details.svg';
import { ErrorMessage } from '../../../components/ErrorMessage';
import { IconWithMessage } from '../../../components/IconWithMessage';
import { TManualDocumentTypes } from '../../../constants/manualFormConstants';
import { OnfidoView } from '../../../containers/Onfido/OnfidoView';

// TODO: Remove optional and default props when POI is ready
type TOnfidoContainer = {
    country?: string;
    isEnabledByDefault?: boolean;
    onOnfidoSubmit?: () => void;
    selectedDocument?: TManualDocumentTypes;
};

export const OnfidoContainer = ({
    country,
    isEnabledByDefault = false,
    onOnfidoSubmit,
    selectedDocument,
}: TOnfidoContainer) => {
    const [isOnfidoEnabled, setIsOnfidoEnabled] = useState(isEnabledByDefault);
    const [transitionEnd, setTransitionEnd] = useState(false);
    const history = useHistory();

    const {
        data: { hasSubmitted, onfidoContainerId, onfidoRef },
        isOnfidoInitialized,
        isServiceTokenLoading,
        onfidoInitializationError,
        serviceTokenError,
    } = useOnfido(country, selectedDocument);

    useEffect(() => {
        if (hasSubmitted) {
            onOnfidoSubmit?.();
            onfidoRef?.current?.safeTearDown();
        }
    }, [hasSubmitted, onfidoRef, onOnfidoSubmit]);

    useEffect(() => {
        let transitionEndTimeout: ReturnType<typeof setTimeout>;
        if (isOnfidoEnabled) {
            transitionEndTimeout = setTimeout(() => setTransitionEnd(true), 350);
        }
        return () => {
            if (transitionEndTimeout) {
                clearTimeout(transitionEndTimeout);
            }
        };
    }, [isOnfidoEnabled]);

    const hasPersonalDetailsValidationError = ['MissingPersonalDetails', 'InvalidPostalCode'].includes(
        serviceTokenError?.error.code ?? ''
    );
    const showErrorMessage = onfidoInitializationError?.message ?? serviceTokenError?.error?.message;

    if (isServiceTokenLoading) {
        return <Loader />;
    } else if (hasPersonalDetailsValidationError) {
        const invalidPostalCode = serviceTokenError?.error.code === 'InvalidPostalCode';
        const missingDetailTitle = invalidPostalCode
            ? 'Your postal code is invalid'
            : 'Your personal details are missing';
        const missingDetailMessage = invalidPostalCode
            ? 'Please check and update your postal code before submitting proof of identity.'
            : 'Please complete your personal details before you verify your identity.';
        const missingDetailButtonText = invalidPostalCode ? 'Update postal code' : 'Go to personal details';

        return (
            <IconWithMessage
                actionButton={
                    <Button
                        onClick={() =>
                            history.push(
                                `/account/personal-details?from=proof_of_identity${
                                    invalidPostalCode ? '#address_postcode' : ''
                                }`
                            )
                        }
                    >
                        {missingDetailButtonText}
                    </Button>
                }
                icon={<IcAccountMissingDetails width={128} />}
                title={missingDetailTitle}
            >
                <Text>{missingDetailMessage}</Text>
            </IconWithMessage>
        );
    } else if (showErrorMessage) {
        return <ErrorMessage message={showErrorMessage} />;
    }

    return (
        <div className={twMerge('flex flex-col items-center gap-16 p-16 lg:p-0')}>
            <div
                className={twMerge(
                    '[transition:transform_0.35s_ease,_opacity_0.35s_linear]origin-top opacity-24 p-16',
                    transitionEnd && 'hidden',
                    isOnfidoEnabled && 'scale-y-0 opacity-50'
                )}
            >
                {/* Do this: Dummy div here replace with PoiConfirmWithExample */}
                <div
                    className='border-1 border-solid border-solid-grey-2 rounded-lg w-[200px] sm:w-[638px] h-[384px]'
                    data-testid='dt_poi_confirm_with_example'
                    onClick={() => setIsOnfidoEnabled(true)}
                    onKeyDown={() => setIsOnfidoEnabled(true)}
                    tabIndex={0}
                />
            </div>
            <OnfidoView
                isOnfidoEnabled={isOnfidoEnabled}
                isOnfidoInitialized={isOnfidoInitialized}
                onfidoElementId={onfidoContainerId}
                showStatusMessage={!isEnabledByDefault && isOnfidoEnabled}
            />
        </div>
    );
};
