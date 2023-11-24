import React, { FC, useCallback, useMemo } from 'react';
import { useDocumentUpload, useIdentityDocumentVerificationAdd, usePOA, usePOI, useSettings } from '@deriv/api';
import { ModalStepWrapper, WalletButton, WalletButtonGroup } from '../../../../components/Base';
import { FlowProvider, TFlowProviderContext } from '../../../../components/FlowProvider';
import { Loader } from '../../../../components/Loader';
import { useModal } from '../../../../components/ModalProvider';
import { THooks } from '../../../../types';
import {
    ManualDocumentUpload,
    ResubmitPOA,
    SelfieDocumentUpload,
    useHandleManualDocumentUpload,
} from '../../../accounts/screens';
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
    selfieScreen: <SelfieDocumentUpload />,
};

type TVerificationProps = {
    selectedJurisdiction: THooks.AvailableMT5Accounts['shortcode'];
};

const Verification: FC<TVerificationProps> = ({ selectedJurisdiction }) => {
    const { data: poiStatus, isSuccess: isSuccessPOIStatus } = usePOI();
    const { data: poaStatus, isSuccess: isSuccessPOAStatus } = usePOA();
    const { isLoading: isUploadLoading, upload } = useDocumentUpload();
    const { isLoading: isManualUploadLoading, uploadDocument } = useHandleManualDocumentUpload();
    const { data: settings, update: updateSettings } = useSettings();
    const { mutate: sendIDVDocuments } = useIdentityDocumentVerificationAdd();
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
        const service = poiStatus?.current?.service as keyof THooks.POI['services'];

        if (service && poiStatus?.services && isSuccessPOIStatus) {
            const serviceStatus = poiStatus.status;

            if (serviceStatus === 'pending' || serviceStatus === 'verified') {
                if (shouldSubmitPOA) return 'poaScreen';
                if (!settings?.has_submitted_personal_details) return 'personalDetailsScreen';
                show(<MT5PasswordModal marketType={selectedMarketType} platform={platform} />);
            }
            if (service === 'idv') return 'idvScreen';
            if (service === 'onfido') return 'onfidoScreen';
            if (service === 'manual') return 'manualScreen';
        }
        return 'loadingScreen';
    }, [
        poiStatus,
        isSuccessPOIStatus,
        shouldSubmitPOA,
        settings?.has_submitted_personal_details,
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
            case 'manualScreen':
                if (formValues.selectedManualDocument === 'driving-license') {
                    return (
                        !formValues.drivingLicenceNumber ||
                        !formValues.drivingLicenseExpiryDate ||
                        !formValues.drivingLicenseCardFront ||
                        !formValues.drivingLicenseCardBack ||
                        isManualUploadLoading
                    );
                } else if (formValues.selectedManualDocument === 'passport') {
                    return (
                        !formValues.passportNumber ||
                        !formValues.passportExpiryDate ||
                        !formValues.passportCard ||
                        isManualUploadLoading
                    );
                } else if (formValues.selectedManualDocument === 'identity-card') {
                    return (
                        !formValues.identityCardNumber ||
                        !formValues.identityCardExpiryDate ||
                        !formValues.identityCardFront ||
                        !formValues.identityCardBack ||
                        isManualUploadLoading
                    );
                } else if (formValues.selectedManualDocument === 'nimc-slip') {
                    return (
                        !formValues.nimcNumber ||
                        !formValues.nimcCardFront ||
                        !formValues.nimcCardBack ||
                        isManualUploadLoading
                    );
                }
                return !formValues.selectedManualDocument;
            case 'selfieScreen':
                return !formValues.selfie;
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

    const isNextLoading = useCallback(
        ({ currentScreenId, formValues }: TFlowProviderContext<typeof screens>) => {
            if (['manualScreen', 'selfieScreen'].includes(currentScreenId) && formValues.selectedManualDocument)
                return isUploadLoading || isManualUploadLoading || isLoading;
            return isLoading;
        },
        [isLoading, isManualUploadLoading, isUploadLoading]
    );

    const nextFlowHandler = useCallback(
        async ({ currentScreenId, formValues, setFormValues, switchScreen }: TFlowProviderContext<typeof screens>) => {
            if (['idvScreen', 'onfidoScreen', 'selfieScreen'].includes(currentScreenId)) {
                // API calls
                if (currentScreenId === 'idvScreen') {
                    sendIDVDocuments(
                        formValues.documentNumber,
                        formValues.documentType,
                        settings?.citizen || formValues?.citizenship
                    );
                    updateSettings({
                        date_of_birth: formValues.dateOfBirth,
                        first_name: formValues.firstName,
                        last_name: formValues.lastName,
                    });
                } else if (currentScreenId === 'selfieScreen') {
                    await upload({
                        document_issuing_country: settings?.country_code ?? undefined,
                        document_type: 'selfie_with_id',
                        file: formValues.selfie,
                    });
                }

                // handle screen switching
                if (shouldSubmitPOA) {
                    switchScreen('poaScreen');
                } else if (!settings?.has_submitted_personal_details) {
                    switchScreen('personalDetailsScreen');
                } else {
                    show(<MT5PasswordModal marketType={selectedMarketType} platform={platform} />);
                }
            } else if (currentScreenId === 'manualScreen') {
                await uploadDocument(formValues);
                setFormValues('selectedManualDocument', '');
                switchScreen('selfieScreen');
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
        },
        [
            hide,
            platform,
            selectedMarketType,
            sendIDVDocuments,
            settings?.citizen,
            settings?.country_code,
            settings?.has_submitted_personal_details,
            shouldSubmitPOA,
            show,
            updateSettings,
            upload,
            uploadDocument,
        ]
    );

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
                        renderFooter={
                            context.currentScreenId === 'manualScreen' && !context.formValues.selectedManualDocument
                                ? undefined
                                : () => {
                                      if (context.currentScreenId === 'manualScreen')
                                          return (
                                              <WalletButtonGroup isFlex>
                                                  <WalletButton
                                                      onClick={() =>
                                                          context.setFormValues('selectedManualDocument', '')
                                                      }
                                                      size='lg'
                                                      text='Back'
                                                      variant='outlined'
                                                  />
                                                  <WalletButton
                                                      disabled={isNextDisabled(context)}
                                                      isLoading={isNextLoading(context)}
                                                      onClick={() => nextFlowHandler(context)}
                                                      size='lg'
                                                      text='Next'
                                                  />
                                              </WalletButtonGroup>
                                          );
                                      return (
                                          <WalletButton
                                              disabled={isNextDisabled(context)}
                                              isLoading={isNextLoading(context)}
                                              onClick={() => nextFlowHandler(context)}
                                              size='lg'
                                              text='Next'
                                          />
                                      );
                                  }
                        }
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
