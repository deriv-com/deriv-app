import { Modal, Text } from '@deriv-com/quill-ui';
import { Localize } from '@deriv/translations';
import { useHistory } from 'react-router';
import { LabelPairedCircleXmarkLgRegularIcon } from '@deriv/quill-icons';
import { usePhoneNumberVerificationSetTimer, useSettings, useVerifyEmail } from '@deriv/hooks';
import { routes } from '@deriv/shared';
import { useDevice } from '@deriv-com/ui';
import { useEffect } from 'react';
import { localize } from '@deriv-com/translations';

type TVerificationLinkExpiredModal = {
    should_show_verification_link_expired_modal: boolean;
    setShouldShowVerificationLinkExpiredModal: (value: boolean) => void;
};

const VerificationLinkExpiredModal = ({
    should_show_verification_link_expired_modal,
    setShouldShowVerificationLinkExpiredModal,
}: TVerificationLinkExpiredModal) => {
    const history = useHistory();
    //@ts-expect-error ignore this until we add it in GetSettings api types
    const { sendPhoneNumberVerifyEmail, WS } = useVerifyEmail('phone_number_verification');
    const { next_request_time } = usePhoneNumberVerificationSetTimer();
    const { invalidate } = useSettings();
    const { isMobile } = useDevice();

    const handleCancelButton = () => {
        setShouldShowVerificationLinkExpiredModal(false);
        history.push(routes.personal_details);
    };

    const handleSendNewLinkButton = () => {
        sendPhoneNumberVerifyEmail();
    };

    const sendNewLinkTimer = () => {
        let sendNewLinkTimer = '';
        if (next_request_time) {
            next_request_time < 60
                ? (sendNewLinkTimer = `${localize(' in ')}${next_request_time}s`)
                : (sendNewLinkTimer = `${localize(' in ')}${Math.round(next_request_time / 60)}m`);
        } else {
            sendNewLinkTimer = '';
        }

        return sendNewLinkTimer;
    };

    useEffect(() => {
        if (WS.isSuccess) invalidate('get_settings').then(() => setShouldShowVerificationLinkExpiredModal(false));
    }, [WS.isSuccess, invalidate]);

    return (
        <Modal
            isMobile={isMobile}
            showHandleBar
            isOpened={should_show_verification_link_expired_modal}
            isPrimaryButtonDisabled={!!next_request_time}
            primaryButtonCallback={handleSendNewLinkButton}
            primaryButtonLabel={
                <Localize
                    i18n_default_text='Send new link{{next_email_attempt_timestamp}}'
                    values={{ next_email_attempt_timestamp: sendNewLinkTimer() }}
                />
            }
            disableCloseOnOverlay
            showSecondaryButton
            secondaryButtonLabel={<Localize i18n_default_text='Cancel' />}
            secondaryButtonCallback={handleCancelButton}
        >
            <Modal.Header
                className='phone-verification__cancel-modal--header'
                image={<LabelPairedCircleXmarkLgRegularIcon fill='#C40000' height={96} width={96} />}
            />
            <Modal.Body>
                <div className='phone-verification__cancel-modal--contents'>
                    <Text bold>
                        <Localize i18n_default_text='Verification link expired' />
                    </Text>
                    <Text>
                        <Localize i18n_default_text='Get another link to verify your number.' />
                    </Text>
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default VerificationLinkExpiredModal;
