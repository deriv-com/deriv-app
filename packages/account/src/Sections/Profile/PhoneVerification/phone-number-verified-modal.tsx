import { useHistory } from 'react-router';
import { Modal, Text } from '@deriv-com/quill-ui';
import { Localize } from '@deriv/translations';
import { routes } from '@deriv/shared';
import { useDevice } from '@deriv-com/ui';
import { useEffect } from 'react';
import { usePhoneVerificationAnalytics } from '@deriv/hooks';

type TPhoneNumberVerifiedModal = {
    should_show_phone_number_verified_modal: boolean;
    setShouldShowPhoneNumberVerifiedModal: (value: boolean) => void;
};

const PhoneNumberVerifiedModal = ({
    should_show_phone_number_verified_modal,
    setShouldShowPhoneNumberVerifiedModal,
}: TPhoneNumberVerifiedModal) => {
    const history = useHistory();
    const handleDoneButton = () => {
        setShouldShowPhoneNumberVerifiedModal(false);
        history.push(routes.personal_details);
    };
    const { isMobile } = useDevice();
    const { trackPhoneVerificationEvents } = usePhoneVerificationAnalytics();

    useEffect(() => {
        if (should_show_phone_number_verified_modal) {
            trackPhoneVerificationEvents({
                action: 'open',
                subform_name: 'verification_successful',
            });
        }
    }, [should_show_phone_number_verified_modal, trackPhoneVerificationEvents]);

    return (
        <Modal
            isMobile={isMobile}
            showHandleBar
            isOpened={should_show_phone_number_verified_modal}
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
};

export default PhoneNumberVerifiedModal;
