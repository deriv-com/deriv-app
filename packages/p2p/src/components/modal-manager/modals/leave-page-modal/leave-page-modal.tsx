import React from 'react';
import { Button, Modal, Text } from '@deriv/components';
import { observer } from '@deriv/stores';
import { Localize } from 'Components/i18next';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import { useStores } from 'Stores';

type TLeavePageModalProps = {
    onCancel?: () => void;
    onLeavePage?: () => void;
};

const LeavePageModal = ({ onLeavePage, onCancel }: TLeavePageModalProps) => {
    const { buy_sell_store } = useStores();
    const { hideModal, is_modal_open } = useModalManagerContext();

    const onClickCancel = () => {
        onCancel?.();
        hideModal({
            should_restore_local_state: true,
        });
    };

    const onClickLeavePage = () => {
        buy_sell_store.setShowFilterPaymentMethods(false);
        onLeavePage?.();
        hideModal({
            should_restore_local_state: false,
            should_hide_all_modals: true,
        });
    };

    return (
        <Modal
            has_close_icon={false}
            is_open={is_modal_open}
            small
            title={
                <Text color='prominent' weight='bold'>
                    <Localize i18n_default_text='Leave page?' />
                </Text>
            }
        >
            <Modal.Body className='leave-page-modal__body'>
                <Text color='prominent' size='xs'>
                    <Localize i18n_default_text='If you leave this page, your unsaved changes will be lost.' />
                </Text>
            </Modal.Body>
            <Modal.Footer>
                <Button large onClick={onClickCancel} secondary>
                    <Localize i18n_default_text='Cancel' />
                </Button>
                <Button large onClick={onClickLeavePage} primary>
                    <Localize i18n_default_text='Leave page' />
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default observer(LeavePageModal);
