import { CaptionText, Modal } from '@deriv-com/quill-ui';
import { Localize } from '@deriv/translations';
import React from 'react';

const PayoutInfoModal = () => {
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
                <Modal.Body>
                    <Localize i18n_default_text='After the entry spot tick, your stake will grow continuously by 1% for every tick that the spot price remains within the ± 0.06444% from the previous spot price.' />
                </Modal.Body>
            </Modal>
        </>
    );
};

export default PayoutInfoModal;
