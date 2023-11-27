import React from 'react';
import { Button, Modal, Text } from '@deriv/components';
import { isMobile } from '@deriv/shared';
import { localize, Localize } from 'Components/i18next';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';

const MarketRateChangeErrorModal = () => {
    const { is_modal_open, hideModal } = useModalManagerContext();

    return (
        <Modal is_open={is_modal_open} onExited={hideModal} small>
            <Modal.Body>
                <Text as='p' size={isMobile() ? 'xxs' : 'xs'} line_height='s'>
                    <Localize i18n_default_text={'The advertiser changed the rate before you confirmed the order.'} />
                </Text>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={hideModal} text={localize('Try again')} primary large />
            </Modal.Footer>
        </Modal>
    );
};

export default MarketRateChangeErrorModal;
