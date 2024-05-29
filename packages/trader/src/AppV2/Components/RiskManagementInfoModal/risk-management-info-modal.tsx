import React from 'react';
import { Modal, SectionMessage, Text } from '@deriv-com/quill-ui';
import { Localize } from '@deriv/translations';
import { LabelPairedCircleInfoSmRegularIcon } from '@deriv/quill-icons';

type RiskManagementInfoModalProps = {
    header_content: React.ReactNode;
    body_content: React.ReactNode;
    info_message?: React.ReactNode;
    is_deal_cancellation_enabled?: boolean;
};

const RiskManagementInfoModal = ({
    header_content,
    body_content,
    info_message,
    is_deal_cancellation_enabled = false,
}: RiskManagementInfoModalProps) => {
    const [isVisible, setIsVisible] = React.useState(false);
    return (
        <>
            <button onClick={() => setIsVisible(!isVisible)}>
                <LabelPairedCircleInfoSmRegularIcon />
            </button>
            <Modal
                isOpened={isVisible}
                toggleModal={setIsVisible}
                primaryButtonLabel={<Localize i18n_default_text='Got it' />}
                shouldCloseOnPrimaryButtonClick
                isMobile
                showHandleBar
            >
                <Modal.Header title={header_content} />
                <Modal.Body>
                    <div className='risk-management-info-modal--container'>
                        <Text size='md'>{body_content}</Text>
                        <SectionMessage message={info_message} size='sm' status='info' title={''} />
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default RiskManagementInfoModal;
