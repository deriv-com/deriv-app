import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { useHistory } from 'react-router-dom';
import { useOnfido } from '@deriv/api';
import { qtMerge } from '@deriv/quill-design';
import { Button, Loader, Text } from '@deriv-com/ui';
import IcAccountMissingDetails from '../../assets/proof-of-identity/ic-account-missing-details.svg';
import { ErrorMessage } from '../../components/ErrorMessage';
import { IconWithMessage } from '../../components/IconWithMessage';
import { OnfidoView } from '../../containers/Onfido/OnfidoView';

// TODO: Remove optional and default props when POI is ready
type TOnfidoContainer = {
    country?: string;
    isEnabledByDefault?: boolean;
    onOnfidoSubmit?: () => void;
};

export const OnfidoContainer = ({ country = 'co', isEnabledByDefault = false, onOnfidoSubmit }: TOnfidoContainer) => {
    const [isOnfidoEnabled, setIsOnfidoEnabled] = useState(isEnabledByDefault);
    const [transitionEnd, setTransitionEnd] = useState(false);
    const history = useHistory();

    const {
        data: { hasSubmitted, onfidoContainerId, onfidoRef },
        isOnfidoInitialized,
        isServiceTokenLoading,
        onfidoInitializationError,
        serviceTokenError,
    } = useOnfido(country);

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
    const showErrorMessage = onfidoInitializationError?.message || serviceTokenError?.error?.message;

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
        <div className={qtMerge('flex flex-col items-center gap-800 p-800 lg:p-50')}>
            <div
                className={clsx(
                    '[transition:transform_0.35s_ease,_opacity_0.35s_linear]origin-top opacity-1300 p-800',
                    { '[display:none]': transitionEnd, 'scale-y-0 opacity-50': isOnfidoEnabled }
                )}
            >
                {/* TODO: Dummy div here replace with PoiConfirmWithExample */}
                <div
                    className='border-75 border-solid border-solid-slate-300 rounded-500 w-[200px] sm:w-[638px] h-[384px]'
                    data-testid='dt_poi-confirm-with-example'
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
