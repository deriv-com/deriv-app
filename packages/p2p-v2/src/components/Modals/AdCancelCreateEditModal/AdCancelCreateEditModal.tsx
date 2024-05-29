import React from 'react';
import { useHistory } from 'react-router-dom';
import { MY_ADS_URL } from '@/constants';
import { useQueryString } from '@/hooks';
import { Button, Modal, Text, useDevice } from '@deriv-com/ui';
import './AdCancelCreateEditModal.scss';

type TAdCancelCreateEditModalProps = {
    isModalOpen: boolean;
    onRequestClose: () => void;
};

const AdCancelCreateEditModal = ({ isModalOpen, onRequestClose }: TAdCancelCreateEditModalProps) => {
    const { isMobile } = useDevice();
    const history = useHistory();
    const { queryString } = useQueryString();
    const { advertId = '' } = queryString;
    const isEdit = !!advertId;
    const textSize = isMobile ? 'md' : 'sm';
    return (
        <Modal
            ariaHideApp={false}
            className='p2p-v2-ad-cancel-create-edit-modal'
            isOpen={isModalOpen}
            shouldCloseOnOverlayClick={false}
        >
            <Modal.Header className='p2p-v2-ad-cancel-create-edit-modal__header' hideBorder hideCloseIcon>
                <Text weight='bold'>{isEdit ? 'Cancel your edits?' : 'Cancel ad creation?'}</Text>
            </Modal.Header>
            <Modal.Body className='p2p-v2-ad-cancel-create-edit-modal__body'>
                <Text size='sm'>
                    {isEdit
                        ? `If you choose to cancel, the edited details will be lost.`
                        : `If you choose to cancel, the details you've entered will be lost.`}
                </Text>
            </Modal.Body>
            <Modal.Footer className='p2p-v2-ad-cancel-create-edit-modal__footer' hideBorder>
                <Button
                    className='border-2'
                    color='black'
                    onClick={() => history.push(MY_ADS_URL)}
                    size='lg'
                    textSize={textSize}
                    variant='outlined'
                >
                    Cancel
                </Button>
                <Button onClick={onRequestClose} size='lg' textSize={textSize}>
                    Don’t cancel
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default AdCancelCreateEditModal;
