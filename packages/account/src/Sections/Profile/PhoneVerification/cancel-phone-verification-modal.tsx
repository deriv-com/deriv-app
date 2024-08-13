import { Modal, Text } from '@deriv-com/quill-ui';
import { Localize } from '@deriv/translations';
import { useHistory } from 'react-router';
import { observer, useStore } from '@deriv/stores';
import { LabelPairedCircleXmarkLgRegularIcon } from '@deriv/quill-icons';
import { useDevice } from '@deriv-com/ui';
import { routes } from '@deriv/shared';

const CancelPhoneVerificationModal = observer(() => {
    const history = useHistory();
    const { ui, client } = useStore();
    const { setShouldShowPhoneNumberOTP, setShouldShowCancelVerificationModal, should_show_cancel_verification_modal } =
        ui;
    const { isMobile } = useDevice();
    const { setVerificationCode } = client;

    const handleCancelButton = () => {
        setVerificationCode('', 'phone_number_verification');
        setShouldShowPhoneNumberOTP(false);
        setShouldShowCancelVerificationModal({ show_modal: false, routing_path: '' });
        history.push(should_show_cancel_verification_modal?.routing_path || routes.personal_details);
    };

    return (
        <Modal
            isMobile={isMobile}
            showHandleBar
            isOpened={should_show_cancel_verification_modal.show_modal}
            primaryButtonCallback={() => setShouldShowCancelVerificationModal({ show_modal: false, routing_path: '' })}
            primaryButtonLabel={<Localize i18n_default_text='Go back' />}
            disableCloseOnOverlay
            showSecondaryButton
            secondaryButtonLabel={<Localize i18n_default_text='Yes, cancel' />}
            secondaryButtonCallback={handleCancelButton}
        >
            <Modal.Header
                className='phone-verification__cancel-modal--header'
                image={<LabelPairedCircleXmarkLgRegularIcon fill='#C40000' height={96} width={96} />}
            />
            <Modal.Body>
                <div className='phone-verification__cancel-modal--contents'>
                    <Text bold>
                        <Localize i18n_default_text='Cancel phone number verification?' />
                    </Text>
                    <Text>
                        <Localize i18n_default_text='All details entered will be lost.' />
                    </Text>
                </div>
            </Modal.Body>
        </Modal>
    );
});

export default CancelPhoneVerificationModal;
