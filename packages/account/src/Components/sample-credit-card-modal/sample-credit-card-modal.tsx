import React from 'react';
import { Modal, Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { getUrlBase } from '@deriv/shared';

type TSampleCreditCardModalProps = {
    is_open: boolean;
    onClose: () => void;
};

/**
 * Display a modal with a sample credit card image and instructions on how to mask the card.
 * @name SampleCreditCardModal
 * @param is_open - boolean to determine if the modal should be open or not
 * @param onClose - function to close the modal
 * @returns React component
 */
export const SampleCreditCardModal = ({ is_open, onClose }: TSampleCreditCardModalProps) => {
    return (
        <Modal
            className='sample-credit-card-modal'
            is_open={is_open}
            should_header_stick_body
            title={<Localize i18n_default_text='How to mask your card?' />}
            toggleModal={onClose}
        >
            <React.Fragment>
                <Text className='sample-credit-card-modal-text' size='xs'>
                    <Localize i18n_default_text='Black out digits 7 to 12 of the card number that’s shown on the front of your debit/credit card.⁤' />
                </Text>
                <img
                    src={getUrlBase('/public/images/common/sample-credit-card.png')}
                    alt='creditcardsample'
                    className='sample-credit-card-modal-img'
                />
            </React.Fragment>
        </Modal>
    );
};
