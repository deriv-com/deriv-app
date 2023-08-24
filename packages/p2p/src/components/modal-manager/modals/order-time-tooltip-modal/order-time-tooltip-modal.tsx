import React from 'react';
import { Button, Modal, Text } from '@deriv/components';
import { Localize } from 'Components/i18next';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';

const OrderTimeTooltipModal = () => {
    const { hideModal, is_modal_open } = useModalManagerContext();

    return (
        <Modal has_close_icon={false} is_open={is_modal_open} small>
            <Modal.Body>
                <Text color='prominent' size='xxs' line_height='xs'>
                    <Localize i18n_default_text='Orders will expire if they aren’t completed within this time.' />
                </Text>
            </Modal.Body>
            <Modal.Footer>
                <Button primary large onClick={hideModal}>
                    <Localize i18n_default_text='Ok' />
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default OrderTimeTooltipModal;
