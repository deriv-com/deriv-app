import React from 'react';
import { Button, Modal } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { Localize, localize } from '@deriv/translations';
import { isDesktop } from '@deriv/shared';

const CFDServerMaintenanceModal = observer(() => {
    const { modules } = useStore();
    const { cfd } = modules;

    const { setServerMaintenanceModal, is_server_maintenance_modal_visible } = cfd;

    return (
        <Modal
            className='cfd-password-modal'
            is_open={is_server_maintenance_modal_visible}
            title={localize('Undergoing server maintenance')}
            toggleModal={() => setServerMaintenanceModal(false)}
            has_close_icon
            width={isDesktop() ? '440px' : '328px'}
        >
            <Modal.Body>
                <Localize
                    i18n_default_text='We’re currently performing server maintenance. Service may be affected.'
                    components={[<strong key={0} />]}
                />
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={() => setServerMaintenanceModal(false)} secondary medium>
                    <Localize i18n_default_text='OK' />
                </Button>
            </Modal.Footer>
        </Modal>
    );
});

export default CFDServerMaintenanceModal;
