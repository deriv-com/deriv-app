import React from 'react';
import { AD_CONDITION_CONTENT } from '@/constants';
import { Button, Modal, Text, useDevice } from '@deriv-com/ui';
import './AdConditionsModal.scss';

type TAdConditionsModalProps = {
    isModalOpen: boolean;
    onRequestClose: () => void;
    type: string;
};

const AdConditionsModal = ({ isModalOpen, onRequestClose, type }: TAdConditionsModalProps) => {
    const { isMobile } = useDevice();
    return (
        <Modal
            ariaHideApp={false}
            className='p2p-v2-ad-conditions-modal'
            isOpen={isModalOpen}
            onRequestClose={onRequestClose}
        >
            <Modal.Header className='px-[1.6rem]' hideBorder hideCloseIcon onRequestClose={onRequestClose}>
                <Text weight='bold'>{AD_CONDITION_CONTENT[type].title}</Text>
            </Modal.Header>
            <Modal.Body className='p-[1.6rem] lg:p-[2.4rem]'>
                <Text className='whitespace-pre-line' size='sm'>
                    {AD_CONDITION_CONTENT[type].description}
                </Text>
            </Modal.Body>
            <Modal.Footer hideBorder>
                <Button onClick={onRequestClose} size='lg' textSize={isMobile ? 'md' : 'sm'} variant='contained'>
                    OK
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default AdConditionsModal;
