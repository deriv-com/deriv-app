import React from 'react';
import { Button, Modal, Text } from '@deriv/components';
import { observer } from '@deriv/stores';
import { localize } from '@deriv/translations';
import { Localize } from 'Components/i18next';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import { useStores } from 'Stores';
import { getMessage } from 'Utils/advertiser';

const BlockedCountModal = () => {
    const { general_store } = useStores();
    const { user_blocked_count } = general_store;
    const { hideModal, is_modal_open } = useModalManagerContext();

    return (
        <Modal has_close_icon={false} is_open={is_modal_open} width='440px'>
            <Modal.Body>
                <Text color='prominent' size='xs'>
                    {getMessage(user_blocked_count)}
                </Text>
            </Modal.Body>
            <Modal.Footer>
                <Button has_effect onClick={hideModal} primary large>
                    <Localize i18n_default_text={localize('Ok')} />
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default observer(BlockedCountModal);
