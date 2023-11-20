import React, { FC, useMemo } from 'react';
import * as Yup from 'yup';
import { useAuthentication, usePOA, usePOI } from '@deriv/api';
import { ModalStepWrapper, WalletButton } from '../../../../components/Base';
import { FlowProvider, TFlowProviderContext } from '../../../../components/FlowProvider';
import { Loader } from '../../../../components/Loader';
import { useModal } from '../../../../components/ModalProvider';
import { THooks } from '../../../../types';
import { ResubmitPOA } from '../../../accounts/screens';
import { IDVDocumentUpload } from '../../../accounts/screens/IDVDocumentUpload';
import { Onfido } from '../../screens';

const Manual = () => {
    return (
        <div style={{ fontSize: 60, height: 400, width: 600 }}>
            <h1>Manual screen</h1>
        </div>
    );
};

const PersonalDetails = () => {
    return (
        <div style={{ fontSize: 60, height: 400, width: 600 }}>
            <h1>Personal details screen</h1>
        </div>
    );
};

const Loading = () => {
    return (
        <div style={{ height: 400, width: 600 }}>
            <Loader />
        </div>
    );
};

const Password = () => {
    return <div style={{ fontSize: 60, height: 400, width: 600 }}>Password screen</div>;
};

// TODO: Replace these mock components with the screens
const screens = {
    idvScreen: <IDVDocumentUpload />,
    loadingScreen: <Loading />,
    manualScreen: <Manual />,
    onfidoScreen: <Onfido />,
    passwordScreen: <Password />,
    personalDetailsScreen: <PersonalDetails />,
    poaScreen: <ResubmitPOA />,
};

type TVerificationProps = {
    selectedJurisdiction: THooks.AvailableMT5Accounts['shortcode'];
};

const Verification: FC<TVerificationProps> = ({ selectedJurisdiction }) => {
    const { data: poiStatus, isSuccess: isSuccessPOIStatus } = usePOI();
    const { data: poaStatus, isSuccess: isSuccessPOAStatus } = usePOA();
    const { data: authenticationData } = useAuthentication();
    const { hide } = useModal();

    const isLoading = useMemo(() => {
        return !isSuccessPOIStatus || !isSuccessPOAStatus;
    }, [isSuccessPOIStatus, isSuccessPOAStatus]);

    const hasAttemptedPOA = poaStatus?.has_attempted_poa || true;
    const needPersonalDetails = true;

    const initialScreenId: keyof typeof screens = useMemo(() => {
        const service = (poiStatus?.current?.service || 'manual') as keyof THooks.POI['services'];

        if (poiStatus?.services) {
            const serviceStatus = poiStatus.services?.[service];

            if (!isSuccessPOIStatus) return 'loadingScreen';
            if (serviceStatus === 'pending' || serviceStatus === 'verified') {
                if (authenticationData?.is_poa_needed && !hasAttemptedPOA) return 'poaScreen';
                if (needPersonalDetails) return 'personalDetailsScreen';
                return 'passwordScreen';
            }
            if (service === 'idv') return 'idvScreen';
            if (service === 'onfido') return 'onfidoScreen';
            return 'manualScreen';
        }
        return 'loadingScreen';
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        hasAttemptedPOA,
        needPersonalDetails,
        authenticationData?.is_poa_needed,
        poiStatus,
        poiStatus?.services,
        poiStatus?.current?.service,
        isSuccessPOIStatus,
    ]);

    const isNextDisabled = ({ currentScreenId, formValues }: TFlowProviderContext<typeof screens>) => {
        switch (currentScreenId) {
            case 'idvScreen':
                return (
                    !formValues.documentNumber ||
                    !formValues.firstName ||
                    !formValues.lastName ||
                    !formValues.dateOfBirth
                );
            default:
                return false;
        }
    };

    const nextFlowHandler = ({ currentScreenId, switchScreen }: TFlowProviderContext<typeof screens>) => {
        if (['idvScreen', 'onfidoScreen', 'manualScreen'].includes(currentScreenId)) {
            if (hasAttemptedPOA) {
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

    // NOTE: These are test validations, add the correct validators here for different screens
    const validationSchema = Yup.object().shape({
        dateOfBirth: Yup.date().required(),
        documentNumber: Yup.string().min(12, 'document number should have minimum 12 characters').required(),
        firstName: Yup.string().min(1).max(5).required(),
        lastName: Yup.string().min(1).max(20).required(),
    });

    return (
        <FlowProvider
            initialScreenId={initialScreenId}
            initialValues={{
                selectedJurisdiction,
            }}
            screens={screens}
            validationSchema={validationSchema}
        >
            {context => {
                return (
                    <ModalStepWrapper
                        renderFooter={() => {
                            return (
                                <WalletButton
                                    disabled={isNextDisabled(context)}
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
