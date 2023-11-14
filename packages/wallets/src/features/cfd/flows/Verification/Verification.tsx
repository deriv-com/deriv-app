import React, { useMemo } from 'react';
import { FlowProvider, TFlowProviderContext, useFlow } from '../../../../components/FlowProvider';
import { useModal } from '../../../../components/ModalProvider';
import { ModalStepWrapper, WalletButton } from '../../../../components/Base';
import { Loader } from '../../../../components/Loader';
import { Onfido } from '../../screens';
import { useAuthentication, usePOA, usePOI } from '@deriv/api';
import { THooks } from '../../../../types';

const Idv = () => {
    return (
        <div style={{ fontSize: 60, width: 600, height: 400 }}>
            <h1>IDV screen</h1>
        </div>
    );
};

const Manual = () => {
    return (
        <div style={{ fontSize: 60, width: 600, height: 400 }}>
            <h1>Manual screen</h1>
        </div>
    );
};

const Poa = () => {
    return (
        <div style={{ fontSize: 60, width: 600, height: 400 }}>
            <h1>POA screen</h1>
        </div>
    );
};

const PersonalDetails = () => {
    return (
        <div style={{ fontSize: 60, width: 600, height: 400 }}>
            <h1>Personal details screen</h1>
        </div>
    );
};

const Loading = () => {
    return (
        <div style={{ fontSize: 60, width: 600, height: 400 }}>
            <Loader />
        </div>
    );
};

const Password = () => {
    return <div style={{ fontSize: 60, width: 600, height: 400 }}>Password screen</div>;
};

// TODO: Replace these mock components with the screens
const screens = {
    onfidoScreen: <Onfido />,
    idvScreen: <Idv />,
    manualScreen: <Manual />,
    poaScreen: <Poa />,
    personalDetailsScreen: <PersonalDetails />,
    loadingScreen: <Loading />,
    passwordScreen: <Password />,
};

const Verification = ({ selectedJurisdiction }: { selectedJurisdiction: string }) => {
    const { data: poiStatus, isSuccess } = usePOI();
    const { data: poaStatus, isSuccess: isSuccessPOAStatus } = usePOA();
    const { data: authenticationData } = useAuthentication();
    const { hide } = useModal();

    const isLoading = useMemo(() => {
        return !isSuccess || !isSuccessPOAStatus;
    }, [isSuccess, isSuccessPOAStatus]);

    const hasAttemptedPOA = poaStatus?.has_attempted_poa || true;
    const needPersonalDetails = true;

    const initialScreenId: keyof typeof screens = useMemo(() => {
        const service = (poiStatus?.next?.service || 'manual') as keyof THooks.POI['services'];

        if (poiStatus?.services) {
            const serviceStatus = poiStatus.services?.[service];

            if (!isSuccess) return 'loadingScreen';
            if (serviceStatus === 'pending' || serviceStatus === 'verified') {
                if (authenticationData?.is_poa_needed && !hasAttemptedPOA) return 'poaScreen';
                if (needPersonalDetails) return 'personalDetailsScreen';
                return 'passwordScreen';
            }
            if (service === 'idv') return 'idvScreen';
            if (service === 'onfido') return 'onfidoScreen';
        }
        return 'manualScreen';
    }, [hasAttemptedPOA, needPersonalDetails, poiStatus?.services, poiStatus?.next?.service, isSuccess]);

    const nextFlowHandler = ({ currentScreenId, switchScreen }: TFlowProviderContext<typeof screens>) => {
        if (['idvScreen', 'onfidoScreen', 'manualScreen'].includes(currentScreenId)) {
            if (!hasAttemptedPOA) {
                switchScreen('poaScreen');
            } else if (needPersonalDetails) {
                switchScreen('personalDetailsScreen');
            } else {
                switchScreen('passwordScreen');
            }
        } else if (currentScreenId === 'poaScreen') {
            if (needPersonalDetails) {
                switchScreen('personalDetailsScreen');
            }
        } else if (currentScreenId === 'personalDetailsScreen') {
            switchScreen('passwordScreen');
        } else {
            hide();
        }
    };

    return (
        <FlowProvider
            initialScreenId={initialScreenId}
            initialValues={{
                selectedJurisdiction,
            }}
            screens={screens}
        >
            {context => {
                return (
                    <ModalStepWrapper
                        renderFooter={() => {
                            return (
                                <WalletButton
                                    isLoading={isLoading}
                                    onClick={() => nextFlowHandler(context)}
                                    size='lg'
                                    text='Next'
                                />
                            );
                        }}
                        title='Add a real MT5 account'
                    >
                        {context.WalletScreen}
                    </ModalStepWrapper>
                );
            }}
        </FlowProvider>
    );
};

export default Verification;
