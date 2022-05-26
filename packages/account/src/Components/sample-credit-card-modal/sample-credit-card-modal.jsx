import React from 'react';
import { Modal, Text } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import { getUrlBase } from '@deriv/shared';

export const SampleCreditCardModal = ({ is_open, onClose }) => {
    return (
        <Modal
            className='sample_credit_card_modal'
            is_open={is_open}
            should_header_stick_body
            title={<Localize i18n_default_text='How to masking your card?' />}
            toggleModal={onClose}
        >
            <React.Fragment>
                <Text className='sample_credit_card_modal-text' size='xs'>
                    {localize(
                        'Black out digits 7 to 12 of the card number that’s shown on the front of your debit/credit card.⁤'
                    )}
                </Text>
                <img
                    src={getUrlBase('/public/images/common/sample-credit-card.png')}
                    alt={'creditcardsample'}
                    className='sample_credit_card_modal-img'
                />
            </React.Fragment>
        </Modal>
    );
};
