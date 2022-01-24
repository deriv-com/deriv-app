import React from 'react';
import { Modal, Text } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import { getUrlBase } from '@deriv/shared';

export const SampleCreditCardModal = ({ is_open, onClose }) => {
    return (
        <Modal
            className='te'
            is_open={is_open}
            should_header_stick_body
            title={<Localize i18n_default_text='How to masking your card?' />}
            toggleModal={onClose}
            width='536px'
            height='494px'
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
                    width='536px' // width and height should be specified so it doesn't jump to the right after image loads
                    height='334px'
                />
            </React.Fragment>
        </Modal>
    );
};
