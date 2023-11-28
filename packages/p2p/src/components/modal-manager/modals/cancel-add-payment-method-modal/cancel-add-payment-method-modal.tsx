import React from 'react';
import { Button, Modal, Text } from '@deriv/components';
import { observer } from '@deriv/stores';
import { Localize } from 'Components/i18next';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import { useStores } from 'Stores';

type TCancelAddPaymentMethodModalProps = {
    onCancel?: () => void;
    should_hide_all_modals_on_cancel?: boolean;
};

const CancelAddPaymentMethodModal = ({
    onCancel,
    should_hide_all_modals_on_cancel,
}: TCancelAddPaymentMethodModalProps) => {
    const { hideModal, is_modal_open } = useModalManagerContext();
    const { my_ads_store, my_profile_store } = useStores();
    const { setShouldShowAddPaymentMethod } = my_ads_store;
    const { hideAddPaymentMethodForm, setSelectedPaymentMethod } = my_profile_store;

    return (
        <Modal
            has_close_icon={false}
            is_open={is_modal_open}
            small
            title={
                <Text color='prominent' weight='bold'>
                    <Localize i18n_default_text='Cancel adding this payment method?' />
                </Text>
            }
        >
            <Modal.Body>
                <Text color='prominent' size='xs'>
                    <Localize i18n_default_text='If you choose to cancel, the details you’ve entered will be lost.' />
                </Text>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    large
                    onClick={() => {
                        hideAddPaymentMethodForm();
                        setSelectedPaymentMethod('');
                        setShouldShowAddPaymentMethod(false);
                        onCancel?.();
                        hideModal({
                            should_save_form_history: false,
                            should_hide_all_modals: should_hide_all_modals_on_cancel ?? false,
                            should_restore_local_state: false,
                        });
                    }}
                    secondary
                >
                    <Localize i18n_default_text='Cancel' />
                </Button>
                <Button
                    large
                    onClick={() => {
                        hideModal({
                            should_save_form_history: true,
                            should_restore_local_state: true,
                        });
                    }}
                    primary
                >
                    <Localize i18n_default_text='Go back' />
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default observer(CancelAddPaymentMethodModal);
