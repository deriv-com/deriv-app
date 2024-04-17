import React from 'react';
import { Modal, Text } from '@deriv-com/ui';
import SampleCreditCard from '../../assets/manual-upload/ic-poi-passport.svg';

type TMaskCardModal = {
    isOpen: boolean;
    onClose: () => void;
};

export const MaskCardModal = ({ isOpen, onClose }: TMaskCardModal) => {
    return (
        <Modal className='w-[440px]' isOpen={isOpen}>
            <Modal.Header onRequestClose={onClose}>
                <Text as='h3' size='md' weight='bold'>
                    How to mask your card?
                </Text>
            </Modal.Header>
            <Modal.Body>
                <Text as='p' className='pt-20 pb-24 pr-24 pl-24' size='sm'>
                    Black out digits 7 to 12 of the card number that’s shown on the front of your debit/credit card.⁤
                </Text>
                <SampleCreditCard />
            </Modal.Body>
        </Modal>
    );
};
