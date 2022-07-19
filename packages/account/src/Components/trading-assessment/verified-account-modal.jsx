import { Modal, Text, Icon, Button } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import React from 'react';

const VerifiedAccountModal = ({ onSubmit, onCancel }) => {
    return (
        <Modal width='44rem' height='30.4rem' is_vertical_centered>
            <Modal.Body>
                <Icon icon='IcCurrency-eur' />
                <Text as='p' size='xs' align='center'>
                    <Localize i18n_default_text='Your account is ready' />
                </Text>
                <Text as='p' size='xs' align='center'>
                    <Localize i18n_default_text='We need proofs of your identity and address before you can start trading.' />
                </Text>
            </Modal.Body>
            <Modal.Footer>
                <Button type='button' large secondary text={localize('Maybe Later')} onClick={() => onCancel(false)} />
                <Button type='button' large primary text={localize('Submit Proof')} onClick={onSubmit} />
            </Modal.Footer>
        </Modal>
    );
};

export default VerifiedAccountModal;
