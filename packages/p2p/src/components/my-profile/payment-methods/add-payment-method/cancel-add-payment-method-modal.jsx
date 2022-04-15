import React from 'react';
import { Button, Modal, Text } from '@deriv/components';
import { observer } from 'mobx-react-lite';
import { useStores } from 'Stores';
import { Localize } from 'Components/i18next';
import { reaction } from 'mobx';
import PropTypes from 'prop-types';

const CancelAddPaymentMethodModal = ({ float }) => {
    const { my_profile_store, my_ads_store } = useStores();

    React.useLayoutEffect(() => {
        const disposeWrapper = reaction(
            () => my_profile_store.is_cancel_add_payment_method_modal_open,
            isOpen => {
                let wrapper = document.getElementById('cancel_modal_root');
                if (isOpen) {
                    if (!wrapper) {
                        wrapper = document.createElement('div');
                        wrapper.setAttribute('id', 'cancel_modal_root');
                    }
                    if (float) {
                        wrapper.classList.add('modal-root');
                        document.body.appendChild(wrapper);
                    }
                } else if (wrapper) {
                    document.body.removeChild(wrapper);
                }
            }
        );

        return () => {
            disposeWrapper();
        };
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
            portalId={float ? 'cancel_modal_root' : undefined}
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
                        my_profile_store.setSelectedPaymentMethod('');
                        my_profile_store.setSelectedPaymentMethodDisplayName('');
                        my_profile_store.setShouldShowAddPaymentMethodForm(false);
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
    float: PropTypes.bool,
};

export default observer(CancelAddPaymentMethodModal);
