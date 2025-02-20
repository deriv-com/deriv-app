import React from 'react';

import { Button, Modal } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { Localize, localize } from '@deriv/translations';
import { useDevice } from '@deriv-com/ui';

const MT5AccountUnavailableModal = observer(() => {
    const { modules } = useStore();
    const { cfd } = modules;
    const { setAccountUnavailableModal, is_account_unavailable_modal_visible } = cfd;
    const { isDesktop } = useDevice();

    return (
        <Modal
            className='cfd-password-modal'
            is_open={is_account_unavailable_modal_visible}
            title={localize('Account temporarily unavailable')}
            toggleModal={() => setAccountUnavailableModal(false)}
            has_close_icon
            width={isDesktop ? '440px' : '328px'}
        >
            <Modal.Body className='dc-modal__container_cfd-password-modal__body'>
                <Localize i18n_default_text='Check back in a few minutes by refreshing the page.' />
            </Modal.Body>
            <Modal.Footer>
                <Button type='button' onClick={() => setAccountUnavailableModal(false)} secondary medium>
                    <Localize i18n_default_text='OK' />
                </Button>
            </Modal.Footer>
        </Modal>
    );
});

export default MT5AccountUnavailableModal;
