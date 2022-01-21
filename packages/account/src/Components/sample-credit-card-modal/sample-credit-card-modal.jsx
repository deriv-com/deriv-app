import React from 'react';
import { Modal, Text, Icon } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';

export const SampleCreditCardModal = ({ is_open, onClose }) => {
    return (
        <Modal
            is_open={is_open}
            should_header_stick_body
            title={
                <Localize
                    i18n_default_text='How to masking your card?'
                />
            }
            toggleModal={onClose}
            width='536px'
            height='494px'
        >
            <React.Fragment>
                <Text className='sample_credit_card_modal-text' size='xs'>
                    {localize('Black out digits 7 to 12 of the card number that’s shown on the front of your debit/credit card.⁤')}
                </Text>
                <Icon icon={'IcSampleCreditCard'} size={536} />

            </React.Fragment>
        </Modal >
    );
};
