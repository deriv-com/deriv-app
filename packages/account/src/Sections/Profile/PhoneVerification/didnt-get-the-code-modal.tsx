import React from 'react';
import { Button, Modal, Text } from '@deriv-com/quill-ui';
import { Localize } from '@deriv/translations';
import { observer, useStore } from '@deriv/stores';
import { VERIFICATION_SERVICES } from '@deriv/shared';
import { useGetPhoneNumberOTP } from '@deriv/hooks';

type TDidntGetTheCodeModal = {
    should_show_didnt_get_the_code_modal: boolean;
    setShouldShowDidntGetTheCodeModal: (value: boolean) => void;
    setStartTimer: (value: boolean) => void;
    phone_verification_type: string;
    setOtpVerification: (value: { show: boolean; phone_verification_type: string }) => void;
};

const DidntGetTheCodeModal = observer(
    ({
        should_show_didnt_get_the_code_modal,
        setShouldShowDidntGetTheCodeModal,
        setStartTimer,
        phone_verification_type,
        setOtpVerification,
    }: TDidntGetTheCodeModal) => {
        const { requestOnSMS, requestOnWhatsApp, ...rest } = useGetPhoneNumberOTP();
        const { ui } = useStore();
        const { is_mobile } = ui;

        const convertPhoneTypeDisplay = () => {
            if (phone_verification_type === VERIFICATION_SERVICES.WHATSAPP)
                return VERIFICATION_SERVICES.SMS.toUpperCase();

            return (
                VERIFICATION_SERVICES.WHATSAPP.charAt(0).toUpperCase() +
                VERIFICATION_SERVICES.WHATSAPP.slice(1, 5) +
                VERIFICATION_SERVICES.WHATSAPP.charAt(5).toUpperCase() +
                VERIFICATION_SERVICES.WHATSAPP.slice(6)
            );
        };

        const handleResendCode = () => {
            phone_verification_type === VERIFICATION_SERVICES.SMS ? requestOnSMS() : requestOnWhatsApp();
            setOtpVerification({ show: true, phone_verification_type });
            setStartTimer(true);
            setShouldShowDidntGetTheCodeModal(false);
        };

        const handleChangeOTPVerification = () => {
            const changed_phone_verification_type =
                phone_verification_type === VERIFICATION_SERVICES.SMS
                    ? VERIFICATION_SERVICES.WHATSAPP
                    : VERIFICATION_SERVICES.SMS;

            phone_verification_type === VERIFICATION_SERVICES.SMS ? requestOnWhatsApp() : requestOnSMS();

            setStartTimer(true);
            setOtpVerification({ show: true, phone_verification_type: changed_phone_verification_type });
            setShouldShowDidntGetTheCodeModal(false);
        };

        const handleChangePhoneNumber = () => {
            setShouldShowDidntGetTheCodeModal(false);
            setOtpVerification({ show: false, phone_verification_type });
        };

        return (
            <Modal
                isMobile={is_mobile}
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
                            <Button fullWidth color='black' size='lg' onClick={handleResendCode}>
                                <Text color='white' bold>
                                    <Localize i18n_default_text='Resend code' />
                                </Text>
                            </Button>
                            <Button
                                fullWidth
                                color='black'
                                variant='secondary'
                                size='lg'
                                onClick={handleChangeOTPVerification}
                            >
                                <Text color='white' bold>
                                    <Localize
                                        i18n_default_text='Send code via {{phone_verification_type}}'
                                        values={{ phone_verification_type: convertPhoneTypeDisplay() }}
                                    />
                                </Text>
                            </Button>
                            <Text>
                                <Localize i18n_default_text='or' />
                            </Text>
                            <Button
                                fullWidth
                                color='black'
                                variant='tertiary'
                                size='lg'
                                onClick={handleChangePhoneNumber}
                            >
                                <Text bold>
                                    <Localize i18n_default_text='Change phone number' />
                                </Text>
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        );
    }
);

export default DidntGetTheCodeModal;
