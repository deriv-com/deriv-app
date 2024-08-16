import { Modal, Text } from '@deriv-com/quill-ui';
import { useDevice } from '@deriv-com/ui';
import { usePhoneNumberVerificationSessionTimer } from '@deriv/hooks';
import { routes } from '@deriv/shared';
import { Localize } from '@deriv/translations';
import { useHistory } from 'react-router';

const SessionTimeoutModal = () => {
    const { isMobile } = useDevice();
    const history = useHistory();
    const { should_show_session_timeout_modal } = usePhoneNumberVerificationSessionTimer();

    const redirectBackToPersonalDetails = () => {
        history.push(routes.personal_details);
    };

    return (
        <Modal
            isMobile={isMobile}
            isOpened={should_show_session_timeout_modal}
            primaryButtonCallback={redirectBackToPersonalDetails}
            primaryButtonLabel={<Localize i18n_default_text='OK' />}
            title='Session Expired'
            disableCloseOnOverlay
        >
            <Modal.Header title={<Localize i18n_default_text='Session Expired' />} />
            <Modal.Body>
                <Text>
                    <Localize i18n_default_text='Your session has expired because the phone number verification was not completed within the allotted 10 minutes. You will be redirected to the email verification page to restart the process.' />
                </Text>
            </Modal.Body>
        </Modal>
    );
};

export default SessionTimeoutModal;
