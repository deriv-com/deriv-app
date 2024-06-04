import React from 'react';
import { RATE_TYPE } from '@/constants';
import { Button, Modal, Text, useDevice } from '@deriv-com/ui';
import './AdRateSwitchModal.scss';

type TAdRateSwitchModalProps = {
    isModalOpen: boolean;
    onClickSet: () => void;
    onRequestClose: () => void;
    rateType?: string;
    reachedEndDate?: boolean;
};
const AdRateSwitchModal = ({
    isModalOpen,
    onClickSet,
    onRequestClose,
    rateType,
    reachedEndDate,
}: TAdRateSwitchModalProps) => {
    const { isMobile } = useDevice();
    const textSize = isMobile ? 'md' : 'sm';
    const isFloat = rateType === RATE_TYPE.FLOAT;
    return (
        <Modal
            ariaHideApp={false}
            className='p2p-v2-ad-rate-switch-modal'
            isOpen={isModalOpen}
            shouldCloseOnOverlayClick={false}
        >
            <Modal.Body className='p2p-v2-ad-rate-switch-modal__body'>
                <Text size='sm'>{isFloat ? 'Set a floating rate for your ad.' : 'Set a fixed rate for your ad.'}</Text>
            </Modal.Body>
            <Modal.Footer className='p2p-v2-ad-rate-switch-modal__footer' hideBorder>
                <Button
                    className='border-2'
                    color='black'
                    onClick={onRequestClose}
                    size='lg'
                    textSize={textSize}
                    variant='outlined'
                >
                    {reachedEndDate ? 'Cancel' : `I'll do this later`}
                </Button>
                <Button onClick={onClickSet} size='lg' textSize={textSize}>
                    {isFloat ? 'Set floating rate' : 'Set fixed rate'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default AdRateSwitchModal;
