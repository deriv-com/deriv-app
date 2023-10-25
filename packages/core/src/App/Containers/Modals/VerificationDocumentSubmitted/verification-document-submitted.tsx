import React from 'react';
import { Button, Icon, Modal, IconWithMessage } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { Localize, localize } from '@deriv/translations';
import './verification-document-submitted.scss';

const VerificationDocumentSubmitted = observer(() => {
    const { ui } = useStore();
    const { is_verification_submitted, setIsVerificationSubmitted } = ui;
    const message = <Localize i18n_default_text='We’ve received your documents' />;
    const description = (
        <Localize i18n_default_text='We’ll need 1 - 3 days to review your documents and notify you by email. You can practice with demo accounts in the meantime.' />
    );
    const onClick = () => {
        setIsVerificationSubmitted(false);
    };

    return (
        <Modal
            className='verification-document-submitted-modal'
            is_open={is_verification_submitted}
            has_close_icon={false}
        >
            <IconWithMessage
                message={message}
                icon={<Icon icon='IcAccountTick' width={72} height={72} />}
                text={description}
            >
                <Button className='dc-dialog__button' has_effect onClick={onClick} primary large>
                    <Localize i18n_default_text='Continue' />
                </Button>
            </IconWithMessage>
        </Modal>
    );
});

export default VerificationDocumentSubmitted;
