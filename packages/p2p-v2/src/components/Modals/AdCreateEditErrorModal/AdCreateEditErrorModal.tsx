import React from 'react';
import { ERROR_CODES } from '@/constants';
import { Button, Modal, Text } from '@deriv-com/ui';

type TAdCreateEditErrorModalProps = {
    errorCode?: ErrorCodes;
    isModalOpen: boolean;
    onRequestClose: () => void;
};

type ErrorCodes = typeof ERROR_CODES[keyof typeof ERROR_CODES];

type ErrorContent = {
    [key in ErrorCodes]?: {
        description: string;
        title: string;
    };
};

const errorContent: ErrorContent = {
    [ERROR_CODES.ADVERT_SAME_LIMITS]: {
        description:
            'Please set a different minimum and/or maximum order limit. \n\nThe range of your ad should not overlap with any of your active ads.',
        title: 'You already have an ad with this range',
    },
    [ERROR_CODES.DUPLICATE_ADVERT]: {
        description:
            'You already have an ad with the same exchange rate for this currency pair and order type. \n\nPlease set a different rate for your ad.',
        title: 'You already have an ad with this rate',
    },
};

const AdCreateEditErrorModal = ({ errorCode, isModalOpen, onRequestClose }: TAdCreateEditErrorModalProps) => {
    return (
        <Modal
            ariaHideApp={false}
            className='create-ad-error-modal'
            isOpen={isModalOpen}
            onRequestClose={onRequestClose}
        >
            <Modal.Header>
                <Text weight='bold'>{(errorCode && errorContent?.[errorCode]?.title) ?? 'Something’s not right'}</Text>
            </Modal.Header>
            <Modal.Body>
                <Text>{(errorCode && errorContent?.[errorCode]?.description) ?? 'Something’s not right'}</Text>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={onRequestClose}>OK</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default AdCreateEditErrorModal;
