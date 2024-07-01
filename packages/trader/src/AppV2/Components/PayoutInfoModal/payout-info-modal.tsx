import { CaptionText, Modal } from '@deriv-com/quill-ui';
import { Localize } from '@deriv/translations';
import React from 'react';

const PayoutInfoModal = ({ body_content }: { body_content: React.ReactNode }) => {
    const [isVisible, setIsVisible] = React.useState(false);
    return (
        <>
            <button onClick={() => setIsVisible(!isVisible)}>
                <CaptionText size='sm' bold underlined className='payout-info-text'>
                    <Localize i18n_default_text='How do I earn a payout?' />
                </CaptionText>
            </button>
            <Modal
                isOpened={isVisible}
                toggleModal={setIsVisible}
                primaryButtonLabel={<Localize i18n_default_text='Got it' />}
                shouldCloseOnPrimaryButtonClick
                isMobile
                showHandleBar
            >
                <Modal.Header title={<Localize i18n_default_text='How do I earn a payout?' />} />
                <Modal.Body>{body_content}</Modal.Body>
            </Modal>
        </>
    );
};

export default PayoutInfoModal;
