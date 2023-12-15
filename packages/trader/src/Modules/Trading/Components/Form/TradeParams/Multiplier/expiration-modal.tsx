import React from 'react';
import { Button, Div100vhContainer, Modal, Text } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import Expiration from './expiration';

type TMultipliersExpirationModalProps = {
    is_open: boolean;
    toggleModal: () => void;
};

const MultipliersExpirationModal = ({ is_open, toggleModal }: TMultipliersExpirationModalProps) => (
    <Modal
        is_open={is_open}
        toggleModal={toggleModal}
        has_close_icon={false}
        should_header_stick_body={false}
        title={<Localize i18n_default_text='Expiration' />}
    >
        <Div100vhContainer className='mobile-widget-dialog__wrapper' max_autoheight_offset='48px'>
            <Text size='xs' color='general' as='div' className='dc-modal-body__expiration'>
                <Localize
                    i18n_default_text='Your contract will be closed automatically at the next available asset price on <0></0>.'
                    components={[<Expiration key={0} is_text_only text_size='xs' />]}
                />
            </Text>
            <Modal.Footer has_separator>
                <Button className='dc-btn__wide' large primary has_effect text={localize('OK')} onClick={toggleModal} />
            </Modal.Footer>
        </Div100vhContainer>
    </Modal>
);

export default MultipliersExpirationModal;
