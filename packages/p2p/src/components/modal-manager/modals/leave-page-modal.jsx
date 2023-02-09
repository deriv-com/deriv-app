import React from 'react';
import { Button, Modal, Text } from '@deriv/components';
import { observer } from 'mobx-react-lite';
import { useStores } from 'Stores';
import { Localize } from 'Components/i18next';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';

const LeavePageModal = ({ onLeavePage = () => {} }) => {
    const { buy_sell_store } = useStores();
    const { hideModal, is_modal_open } = useModalManagerContext();

    return (
        <Modal
            has_close_icon={false}
            is_open={is_modal_open}
            small
            title={
                <Text color='prominent' size='s' weight='bold'>
                    <Localize i18n_default_text='Leave page?' />
                </Text>
            }
        >
            <Modal.Body>
                <Text color='prominent' size='xs'>
                    <Localize i18n_default_text='Are you sure you want to leave this page? Changes made will not be saved.' />
                </Text>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    large
                    onClick={() => {
                        buy_sell_store.setShowFilterPaymentMethods(true);
                        hideModal({
                            should_restore_local_state: true,
                        });
                    }}
                    secondary
                >
                    <Localize i18n_default_text='Cancel' />
                </Button>
                <Button
                    large
                    onClick={() => {
                        buy_sell_store.setShowFilterPaymentMethods(false);
                        onLeavePage();
                        hideModal({
                            should_restore_local_state: false,
                        });
                    }}
                    primary
                >
                    <Localize i18n_default_text='Leave page' />
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default observer(LeavePageModal);
