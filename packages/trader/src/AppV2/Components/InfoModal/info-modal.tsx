import { CaptionText, Modal } from '@deriv-com/quill-ui';
import { localize } from '@deriv/translations';
import React from 'react';

type InfoModalProps = {
    icon?: React.ReactNode;
    header_content: string;
    body_content: string;
    className?: string;
};

const InfoModal = ({ header_content, body_content, icon }: InfoModalProps) => {
    const [isVisible, setIsVisible] = React.useState(false);
    return (
        <>
            <button onClick={() => setIsVisible(!isVisible)}>
                {icon ? (
                    <>{icon}</>
                ) : (
                    <CaptionText size='sm' bold underlined className='payout-info-text'>
                        {header_content}
                    </CaptionText>
                )}
            </button>
            <Modal
                isOpened={isVisible}
                toggleModal={setIsVisible}
                primaryButtonLabel={localize('Got it')}
                shouldCloseOnPrimaryButtonClick
                isMobile
                showHandleBar
            >
                <Modal.Header title={header_content} />
                <Modal.Body>{body_content}</Modal.Body>
            </Modal>
        </>
    );
};

export default InfoModal;
