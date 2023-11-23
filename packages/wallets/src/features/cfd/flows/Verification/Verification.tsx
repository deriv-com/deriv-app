import React, { FC, useMemo } from 'react';
import { usePOA, usePOI, useSettings } from '@deriv/api';
import { ModalStepWrapper, WalletButton } from '../../../../components/Base';
import { FlowProvider, TFlowProviderContext } from '../../../../components/FlowProvider';
import { Loader } from '../../../../components/Loader';
import { useModal } from '../../../../components/ModalProvider';
import { THooks } from '../../../../types';
import { ManualDocumentUpload, ResubmitPOA } from '../../../accounts/screens';
import { IDVDocumentUpload } from '../../../accounts/screens/IDVDocumentUpload';
import { PersonalDetails } from '../../../accounts/screens/PersonalDetails';
import { MT5PasswordModal } from '../../modals';
import { Onfido } from '../../screens';

const Loading = () => {
    return (
        <div style={{ height: 400, width: 600 }}>
            <Loader />
        </div>
    );
};

// TODO: Replace these mock components with the screens
const screens = {
    idvScreen: <IDVDocumentUpload />,
    loadingScreen: <Loading />,
    manualScreen: <ManualDocumentUpload />,
    onfidoScreen: <Onfido />,
    personalDetailsScreen: <PersonalDetails />,
    poaScreen: <ResubmitPOA />,
};

type TVerificationProps = {
    selectedJurisdiction: THooks.AvailableMT5Accounts['shortcode'];
};

const Verification: FC<TVerificationProps> = ({ selectedJurisdiction }) => {
    const { data: poiStatus, isSuccess: isSuccessPOIStatus } = usePOI();
    const { data: poaStatus, isSuccess: isSuccessPOAStatus } = usePOA();
    const { data: getSettings, update: updateSettings } = useSettings();
    const { getModalState, hide, show } = useModal();

    const selectedMarketType = getModalState('marketType') || 'all';
    const platform = getModalState('platform') || 'mt5';
    const shouldSubmitPOA = useMemo(
        () => !poaStatus?.has_attempted_poa || (!poaStatus?.is_pending && !poaStatus.is_verified),
        [poaStatus]
    );

    const isLoading = useMemo(() => {
        return !isSuccessPOIStatus || !isSuccessPOAStatus;
    }, [isSuccessPOIStatus, isSuccessPOAStatus]);

    const initialScreenId: keyof typeof screens = useMemo(() => {
        const service = (poiStatus?.current?.service || 'manual') as keyof THooks.POI['services'];

        if (poiStatus?.services && isSuccessPOIStatus) {
            const serviceStatus = poiStatus.status;

            if (!isSuccessPOIStatus) return 'loadingScreen';
            if (serviceStatus === 'pending' || serviceStatus === 'verified') {
                if (shouldSubmitPOA) return 'poaScreen';
                if (!getSettings?.has_submitted_personal_details) return 'personalDetailsScreen';
                show(<MT5PasswordModal marketType={selectedMarketType} platform={platform} />);
            }
            if (service === 'idv') return 'idvScreen';
            if (service === 'onfido') return 'onfidoScreen';
        }
        return 'loadingScreen';
    }, [
        poiStatus,
        isSuccessPOIStatus,
        shouldSubmitPOA,
        getSettings?.has_submitted_personal_details,
        show,
        selectedMarketType,
        platform,
    ]);

    const isNextDisabled = ({ currentScreenId, errors, formValues }: TFlowProviderContext<typeof screens>) => {
        switch (currentScreenId) {
            case 'idvScreen':
                return (
                    !formValues.documentNumber ||
                    !formValues.firstName ||
                    !formValues.lastName ||
                    !formValues.dateOfBirth ||
                    !!errors.documentNumber
                );
            case 'onfidoScreen':
                return !formValues.hasSubmittedOnfido;
            case 'personalDetailsScreen':
                return (
                    !formValues.citizenship ||
                    !formValues.placeOfBirth ||
                    !formValues.taxResidence ||
                    !formValues.accountOpeningReason ||
                    !formValues.taxIdentificationNumber
                );
            case 'poaScreen':
                return !formValues.townCityLine || !formValues.firstLine;
            default:
                return false;
        }
    };

    const nextFlowHandler = ({ currentScreenId, formValues, switchScreen }: TFlowProviderContext<typeof screens>) => {
        if (['idvScreen', 'onfidoScreen', 'manualScreen'].includes(currentScreenId)) {
            if (currentScreenId === 'idvScreen') {
                updateSettings({
                    date_of_birth: formValues.dateOfBirth,
                    first_name: formValues.firstName,
                    last_name: formValues.lastName,
                });
            } else if (currentScreenId === 'manualScreen') {
                // TODO: call the api here
            }
            if (shouldSubmitPOA) {
                switchScreen('poaScreen');
            } else if (!getSettings?.has_submitted_personal_details) {
                switchScreen('personalDetailsScreen');
            } else {
                show(<MT5PasswordModal marketType={selectedMarketType} platform={platform} />);
            }
        } else if (currentScreenId === 'poaScreen') {
            updateSettings({
                address_city: formValues.townCityLine,
                address_line_1: formValues.firstLine,
                address_line_2: formValues.secondLine,
                address_postcode: formValues.zipCodeLine,
                address_state: formValues.stateProvinceDropdownLine,
            });
            switchScreen('personalDetailsScreen');
        } else if (currentScreenId === 'personalDetailsScreen') {
            updateSettings({
                account_opening_reason: formValues.accountOpeningReason,
                citizen: formValues.citizenship,
                place_of_birth: formValues.placeOfBirth,
                tax_identification_number: formValues.taxIdentificationNumber,
                tax_residence: formValues.taxResidence,
            });
            show(<MT5PasswordModal marketType={selectedMarketType} platform={platform} />);
        } else {
            hide();
        }
    };

    return (
        <FlowProvider
            initialScreenId={initialScreenId}
            initialValues={{
                hasSubmittedOnfido: false,
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
