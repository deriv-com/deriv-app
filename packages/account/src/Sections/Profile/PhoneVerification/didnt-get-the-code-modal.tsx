import { Button, Modal, Text } from '@deriv-com/quill-ui';
import { Localize, localize } from '@deriv/translations';
import { VERIFICATION_SERVICES } from '@deriv/shared';
import { convertPhoneTypeDisplay } from '../../../Helpers/utils';
import { TSocketError } from '@deriv/api/types';
import { useDevice } from '@deriv-com/ui';
import { useEffect } from 'react';

type TDidntGetTheCodeModal = {
    phone_verification_type: string;
    should_show_didnt_get_the_code_modal: boolean;
    setIsButtonDisabled: (value: boolean) => void;
    setShouldShowDidntGetTheCodeModal: (value: boolean) => void;
    requestOnSMS: () => void;
    requestOnWhatsApp: () => void;
    clearOtpValue: () => void;
    is_email_verified: boolean;
    email_otp_error: TSocketError<'phone_number_challenge'> | null;
    setOtpVerification: (value: { show_otp_verification: boolean; phone_verification_type: string }) => void;
    reInitializeGetSettings: () => void;
};

const DidntGetTheCodeModal = ({
    should_show_didnt_get_the_code_modal,
    setShouldShowDidntGetTheCodeModal,
    setIsButtonDisabled,
    reInitializeGetSettings,
    requestOnSMS,
    requestOnWhatsApp,
    clearOtpValue,
    phone_verification_type,
    is_email_verified,
    email_otp_error,
    setOtpVerification,
}: TDidntGetTheCodeModal) => {
    const { isMobile } = useDevice();

    useEffect(() => {
        if (is_email_verified || email_otp_error) reInitializeGetSettings();
    }, [is_email_verified, email_otp_error, reInitializeGetSettings]);

    const setDidntGetACodeButtonDisabled = () => {
        setIsButtonDisabled(true);
    };

    const handleResendCode = () => {
        clearOtpValue();
        setDidntGetACodeButtonDisabled();
        phone_verification_type === VERIFICATION_SERVICES.SMS ? requestOnSMS() : requestOnWhatsApp();
        setOtpVerification({ show_otp_verification: true, phone_verification_type });
        setShouldShowDidntGetTheCodeModal(false);
    };

    const handleChangeOTPVerification = () => {
        clearOtpValue();
        setDidntGetACodeButtonDisabled();
        const changed_phone_verification_type =
            phone_verification_type === VERIFICATION_SERVICES.SMS
                ? VERIFICATION_SERVICES.WHATSAPP
                : VERIFICATION_SERVICES.SMS;

        phone_verification_type === VERIFICATION_SERVICES.SMS ? requestOnWhatsApp() : requestOnSMS();

        setOtpVerification({
            show_otp_verification: true,
            phone_verification_type: changed_phone_verification_type,
        });
        setShouldShowDidntGetTheCodeModal(false);
    };

    const handleChangePhoneNumber = () => {
        clearOtpValue();
        setShouldShowDidntGetTheCodeModal(false);
        setOtpVerification({ show_otp_verification: false, phone_verification_type });
    };

    return (
        <Modal
            isMobile={isMobile}
            showHandleBar
            isOpened={should_show_didnt_get_the_code_modal}
            disableCloseOnOverlay
            showCrossIcon
            toggleModal={() => setShouldShowDidntGetTheCodeModal(false)}
            hasFooter={false}
        >
            <Modal.Body>
                <div className='phone-verification__get-code-modal--contents'>
                    <Text bold>
                        <Localize i18n_default_text='Get a new code' />
                    </Text>
                    <div className='phone-verification__get-code-modal--contents__buttons'>
                        <Button fullWidth color='black-white' size='lg' onClick={handleResendCode}>
                            <Text color='white' bold>
                                <Localize i18n_default_text='Resend code' />
                            </Text>
                        </Button>
                        <Button
                            fullWidth
                            color='black-white'
                            variant='secondary'
                            size='lg'
                            onClick={handleChangeOTPVerification}
                        >
                            <Text color='white' bold>
                                <Localize
                                    i18n_default_text='Send code via {{phone_verification_type}}'
                                    values={{
                                        phone_verification_type: localize(
                                            convertPhoneTypeDisplay(
                                                phone_verification_type === VERIFICATION_SERVICES.SMS
                                                    ? VERIFICATION_SERVICES.WHATSAPP
                                                    : VERIFICATION_SERVICES.SMS
                                            )
                                        ),
                                    }}
                                />
                            </Text>
                        </Button>
                        <Text>
                            <Localize i18n_default_text='or' />
                        </Text>
                        <Button fullWidth variant='tertiary' size='lg' onClick={handleChangePhoneNumber} color='black'>
                            <Text bold>
                                <Localize i18n_default_text='Change phone number' />
                            </Text>
                        </Button>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default DidntGetTheCodeModal;
