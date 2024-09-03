import { useEffect } from 'react';
import { usePhoneVerificationAnalytics, useSettings } from '@deriv/hooks';
import { Modal, Text } from '@deriv-com/quill-ui';
import { Localize } from '@deriv-com/translations';
import { useDevice } from '@deriv-com/ui';
import { observer, useStore } from '@deriv/stores';

type TPhoneNumberVerifiedModal = {
    should_show_phone_number_verified_modal: boolean;
    setShouldShowPhoneNumberVerifiedModal: (value: boolean) => void;
};

const PhoneNumberVerifiedModal = observer(
    ({ should_show_phone_number_verified_modal, setShouldShowPhoneNumberVerifiedModal }: TPhoneNumberVerifiedModal) => {
        const { refetch } = useSettings();
        const handleDoneButton = () => {
            refetch().then(() => {
                setShouldShowPhoneNumberVerifiedModal(false);
            });
        };
        const { isMobile } = useDevice();
        const { ui } = useStore();
        const { setIsPhoneVerificationCompleted } = ui;
        const { trackPhoneVerificationEvents } = usePhoneVerificationAnalytics();

        useEffect(() => {
            if (should_show_phone_number_verified_modal) {
                trackPhoneVerificationEvents({
                    action: 'open',
                    subform_name: 'verification_successful',
                });
                setIsPhoneVerificationCompleted(true);
            }
        }, [should_show_phone_number_verified_modal, trackPhoneVerificationEvents]);

        return (
            <Modal
                isMobile={isMobile}
                isOpened={should_show_phone_number_verified_modal}
                showHandleBar={false}
                showCrossIcon={false}
                buttonColor='coral'
                primaryButtonCallback={handleDoneButton}
                primaryButtonLabel={<Localize i18n_default_text='OK' />}
                disableCloseOnOverlay
            >
                <Modal.Header title={<Localize i18n_default_text='Success' />} />
                <Modal.Body>
                    <div className='phone-verification__verified-modal--contents'>
                        <Text>
                            <Localize i18n_default_text='Your phone number is verified.' />
                        </Text>
                    </div>
                </Modal.Body>
            </Modal>
        );
    }
);

export default PhoneNumberVerifiedModal;
