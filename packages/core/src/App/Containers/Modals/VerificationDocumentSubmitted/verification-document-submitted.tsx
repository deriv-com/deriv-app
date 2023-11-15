import React from 'react';
import { Button, Modal, MessageWithIcon } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { Localize } from '@deriv/translations';
import './verification-document-submitted.scss';

const VerificationDocumentSubmitted = observer(() => {
    const { ui, client } = useStore();
    const {
        is_verification_submitted,
        is_from_success_deposit_modal,
        setIsVerificationSubmitted,
        setShouldTriggerTourGuide,
        setIsFromSuccessDepositModal,
    } = ui;
    const { updateMT5Status } = client;
    const message = <Localize i18n_default_text='We’ve received your documents' />;
    const description = (
        <Localize i18n_default_text='We’ll need 1 - 3 days to review your documents and notify you by email. You can practice with demo accounts in the meantime.' />
    );

    React.useEffect(() => {
        updateMT5Status();
    }, [updateMT5Status]);

    const onClick = () => {
        if (is_from_success_deposit_modal) {
            setShouldTriggerTourGuide(true);
            setIsFromSuccessDepositModal(false);
        }
        setIsVerificationSubmitted(false);
    };

    return (
        <Modal
            className='verification-document-submitted-modal'
            is_open={is_verification_submitted}
            has_close_icon={false}
        >
            <MessageWithIcon message={message} icon='IcAccountTick' text={description}>
                <Button className='dc-dialog__button' has_effect onClick={onClick} primary large>
                    <Localize i18n_default_text='Continue' />
                </Button>
            </MessageWithIcon>
        </Modal>
    );
});

export default VerificationDocumentSubmitted;
