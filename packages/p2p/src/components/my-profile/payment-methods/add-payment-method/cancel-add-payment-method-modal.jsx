import React from 'react';
import PropTypes from 'prop-types';
import { Button, Modal, Text } from '@deriv/components';
import { observer } from 'mobx-react-lite';
import { useStores } from 'Stores';
import { Localize } from 'Components/i18next';
import { reaction } from 'mobx';

const CancelAddPaymentMethodModal = ({ is_floating }) => {
    const { my_profile_store, my_ads_store } = useStores();

    // TODO: Refactor this code to avoid manual DOM updates
    // mounts the modal in a seperate modal-root container to show/float the modal over another modal if is_floating is true
    React.useLayoutEffect(() => {
        const disposeFloatingWrapper = reaction(
            () => my_profile_store.is_cancel_add_payment_method_modal_open,
            is_open => {
                let wrapper = document.getElementById('cancel_modal_root');
                if (is_open) {
                    if (!wrapper) {
                        wrapper = document.createElement('div');
                        wrapper.setAttribute('id', 'cancel_modal_root');
                    }
                    if (is_floating) {
                        wrapper.classList.add('modal-root');
                        document.body.appendChild(wrapper);
                    }
                } else if (wrapper) {
                    document.body.removeChild(wrapper);
                }
            }
        );

        return () => {
            disposeFloatingWrapper();
            my_profile_store.setSelectedPaymentMethod('');
            my_profile_store.setSelectedPaymentMethodDisplayName('');
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Modal
            has_close_icon={false}
            is_open={my_profile_store.is_cancel_add_payment_method_modal_open}
            small
            title={
                <Text color='prominent' size='s' weight='bold'>
                    <Localize i18n_default_text='Cancel adding this payment method?' />
                </Text>
            }
            portalId={is_floating ? 'cancel_modal_root' : undefined}
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
                        my_profile_store.setIsCancelAddPaymentMethodModalOpen(false);
                        my_profile_store.hideAddPaymentMethodForm();
                        my_profile_store.setIsCancelEditPaymentMethodModalOpen(false);
                        my_ads_store.setShouldShowAddPaymentMethodModal(false);
                    }}
                    secondary
                >
                    <Localize i18n_default_text='Cancel' />
                </Button>
                <Button
                    large
                    onClick={() => {
                        my_profile_store.setIsCancelAddPaymentMethodModalOpen(false);
                    }}
                    primary
                >
                    <Localize i18n_default_text='Go back' />
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

CancelAddPaymentMethodModal.propTypes = {
    is_floating: PropTypes.bool,
};

export default observer(CancelAddPaymentMethodModal);
